// src/config/database.js
require('dotenv').config({ path: '.env.txt' });

const Database = require('better-sqlite3');
const path = require('path');
const { initCsvImportIfNeeded } = require('../utils/csvImporter');

const dbPath = process.env.DATABASE_FILE || './sales.db';
const db = new Database(path.resolve(dbPath));

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT,
    date TEXT,
    customer_id TEXT,
    customer_name TEXT,
    phone_number TEXT,
    gender TEXT,
    age INTEGER,
    customer_region TEXT,
    customer_type TEXT,
    product_id TEXT,
    product_name TEXT,
    brand TEXT,
    product_category TEXT,
    tags TEXT,
    quantity INTEGER,
    price_per_unit REAL,
    discount_percentage REAL,
    total_amount REAL,
    final_amount REAL,
    payment_method TEXT,
    order_status TEXT,
    delivery_type TEXT,
    store_id TEXT,
    store_location TEXT,
    salesperson_id TEXT,
    employee_name TEXT
  );
`);

// Indexes
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
  CREATE INDEX IF NOT EXISTS idx_sales_customer_region ON sales(customer_region);
  CREATE INDEX IF NOT EXISTS idx_sales_product_category ON sales(product_category);
  CREATE INDEX IF NOT EXISTS idx_sales_customer_name ON sales(customer_name);
  CREATE INDEX IF NOT EXISTS idx_sales_phone_number ON sales(phone_number);
  CREATE INDEX IF NOT EXISTS idx_sales_payment_method ON sales(payment_method);
`);

async function initDatabase() {
  await initCsvImportIfNeeded(db);
}

module.exports = {
  db,
  initDatabase,
};
