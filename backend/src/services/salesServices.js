// src/services/salesServices.js
const { db } = require("../config/database");
const { normalizeQuery, buildSalesQueries } = require("../utils/queryBuilder");

let cachedTags = null;

function getSales(query) {
  const norm = normalizeQuery(query);
  const { dataSql, statsSql, params } = buildSalesQueries(norm);

  const dataStmt = db.prepare(dataSql);
  const statsStmt = db.prepare(statsSql);

  const rows = dataStmt.all(params);
  const stats = statsStmt.get(params);

  return {
    data: rows,
    pagination: {
      page: norm.page,
      pageSize: norm.pageSize,
      totalRows: stats.totalRows || 0,
    },
    stats: {
      totalUnits: stats.totalUnits || 0,
      totalAmount: stats.totalAmount || 0,
      totalDiscount: stats.totalDiscount || 0,
    },
  };
}

// Compute all unique tags once and cache
function getAllTags() {
  if (cachedTags) return cachedTags;

  const tagSet = new Set();
  const stmt = db.prepare(
    "SELECT tags FROM sales WHERE tags IS NOT NULL AND tags <> ''"
  );

  for (const row of stmt.iterate()) {
    String(row.tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => tagSet.add(t));
  }

  cachedTags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  return cachedTags;
}

module.exports = {
  getSales,
  getAllTags,
};
