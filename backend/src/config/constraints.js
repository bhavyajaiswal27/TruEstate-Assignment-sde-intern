// src/config/constraints.js

// Allowed sort fields (UI: date, quantity, customer name)
const SORT_FIELDS = {
  date: 'date',
  quantity: 'quantity',
  customerName: 'customer_name',
};

const SORT_ORDERS = ['asc', 'desc'];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

module.exports = {
  SORT_FIELDS,
  SORT_ORDERS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
};
