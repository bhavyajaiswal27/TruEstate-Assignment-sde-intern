// src/utils/queryBuilder.js
const {
  SORT_FIELDS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} = require('../config/constraints');

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseIntOrDefault(v, def) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? def : n;
}

function normalizeQuery(query) {
  const {
    search,
    region,
    gender,
    category,
    tags,
    payment,
    ageMin,
    ageMax,
    dateFrom,
    dateTo,
    sortField,
    sortOrder,
    page,
    pageSize,
  } = query;

  const norm = {
    search: search ? String(search).trim() : '',
    filters: {
      region: toArray(region),
      gender: toArray(gender),
      category: toArray(category),
      tags: toArray(tags),
      payment: toArray(payment),
      ageMin: ageMin ? parseInt(ageMin, 10) : null,
      ageMax: ageMax ? parseInt(ageMax, 10) : null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    },
    sort: {
      field: SORT_FIELDS[sortField] ? sortField : 'date',
      order: sortOrder === 'asc' ? 'asc' : 'desc',
    },
    page: parseIntOrDefault(page, DEFAULT_PAGE),
    pageSize: Math.min(
      parseIntOrDefault(pageSize, DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE
    ),
  };

  if (norm.page < 1) norm.page = 1;

  return norm;
}

function buildWhereClause(norm) {
  const { search, filters } = norm;
  const whereParts = [];
  const params = {};

  if (search) {
    params.search = `%${search.toLowerCase()}%`;
    whereParts.push(
      '(LOWER(customer_name) LIKE @search OR phone_number LIKE @search)'
    );
  }

  const { region, gender, category, tags, payment, ageMin, ageMax, dateFrom, dateTo } =
    filters;

  function addInClause(values, column, prefix) {
    if (!values || !values.length) return;
    const placeholders = values.map((_, i) => `@${prefix}${i}`);
    values.forEach((v, i) => {
      params[`${prefix}${i}`] = v;
    });
    whereParts.push(`${column} IN (${placeholders.join(',')})`);
  }

  addInClause(region, 'customer_region', 'region');
  addInClause(gender, 'gender', 'gender');
  addInClause(category, 'product_category', 'cat');
  addInClause(payment, 'payment_method', 'pay');

  if (tags && tags.length) {
    // simple LIKE match on tags
    tags.forEach((t, i) => {
      const key = `tag${i}`;
      params[key] = `%${t.toLowerCase()}%`;
      whereParts.push(`LOWER(tags) LIKE @${key}`);
    });
  }

  if (ageMin != null) {
    params.ageMin = ageMin;
    whereParts.push('age >= @ageMin');
  }
  if (ageMax != null) {
    params.ageMax = ageMax;
    whereParts.push('age <= @ageMax');
  }

  if (dateFrom) {
    params.dateFrom = dateFrom;
    whereParts.push('date >= @dateFrom');
  }
  if (dateTo) {
    params.dateTo = dateTo;
    whereParts.push('date <= @dateTo');
  }

  const whereSql = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

  return { whereSql, params };
}

function buildSalesQueries(norm) {
  const { sort, page, pageSize } = norm;
  const { whereSql, params } = buildWhereClause(norm);

  const sortColumn = SORT_FIELDS[sort.field] || 'date';
  const sortDir = sort.order === 'asc' ? 'ASC' : 'DESC';

  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const dataSql = `
    SELECT *
    FROM sales
    ${whereSql}
    ORDER BY ${sortColumn} ${sortDir}
    LIMIT @limit OFFSET @offset
  `;

  const statsSql = `
    SELECT
      COUNT(*) AS totalRows,
      COALESCE(SUM(quantity), 0) AS totalUnits,
      COALESCE(SUM(total_amount), 0) AS totalAmount,
      COALESCE(SUM(total_amount - final_amount), 0) AS totalDiscount
    FROM sales
    ${whereSql}
  `;

  return {
    dataSql,
    statsSql,
    params: { ...params, limit, offset },
  };
}

module.exports = {
  normalizeQuery,
  buildSalesQueries,
};
