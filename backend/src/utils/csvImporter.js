// src/utils/csvImporter.js
const axios = require("axios");
const csv = require("csv-parser");
const { db } = require("../config/database");

const BATCH_SIZE = 1000;

async function importCsvIfNeeded() {
  // 1. Check if table exists and has data
  const table = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='sales'"
    )
    .get();

  if (table) {
    const row = db
      .prepare("SELECT COUNT(*) AS cnt FROM sales")
      .get();
    if (row.cnt > 0) {
      console.log("[CSV IMPORT] sales table already populated, skipping import.");
      return;
    }
  }

  const csvUrl = process.env.CSV_URL;
  if (!csvUrl) {
    throw new Error("CSV_URL is not set in .env.txt");
  }

  console.log("[CSV IMPORT] Downloading CSV from:", csvUrl);

  const response = await axios({
    method: "GET",
    url: csvUrl,
    responseType: "stream",
  });

  // prepare INSERT statement (adjust column names if yours differ)
  const insertStmt = db.prepare(`
    INSERT INTO sales (
      transaction_id,
      date,
      customer_id,
      customer_name,
      phone_number,
      gender,
      age,
      customer_region,
      customer_type,
      product_id,
      product_name,
      brand,
      product_category,
      tags,
      quantity,
      price_per_unit,
      discount_percentage,
      total_amount,
      final_amount,
      payment_method,
      order_status,
      delivery_type,
      store_id,
      store_location,
      salesperson_id,
      employee_name
    )
    VALUES (
      @transaction_id,
      @date,
      @customer_id,
      @customer_name,
      @phone_number,
      @gender,
      @age,
      @customer_region,
      @customer_type,
      @product_id,
      @product_name,
      @brand,
      @product_category,
      @tags,
      @quantity,
      @price_per_unit,
      @discount_percentage,
      @total_amount,
      @final_amount,
      @payment_method,
      @order_status,
      @delivery_type,
      @store_id,
      @store_location,
      @salesperson_id,
      @employee_name
    )
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insertStmt.run(row);
    }
  });

  console.log("[CSV IMPORT] Streaming and importing…");

  await new Promise((resolve, reject) => {
    const batch = [];

    response.data
      .pipe(csv())
      .on("data", (raw) => {
        // Map CSV headers → DB column names (adjust names to match CSV exactly)
        const row = {
          transaction_id: raw["Transaction ID"],
          date: raw["Date"],
          customer_id: raw["Customer ID"],
          customer_name: raw["Customer Name"],
          phone_number: raw["Phone Number"],
          gender: raw["Gender"],
          age: Number(raw["Age"]) || null,
          customer_region: raw["Customer Region"],
          customer_type: raw["Customer Type"],
          product_id: raw["Product ID"],
          product_name: raw["Product Name"],
          brand: raw["Brand"],
          product_category: raw["Category"],
          tags: raw["Tags"],
          quantity: Number(raw["Quantity"]) || 0,
          price_per_unit: Number(raw["Price per Unit"]) || 0,
          discount_percentage: Number(raw["Discount Percentage"]) || 0,
          total_amount: Number(raw["Total Amount"]) || 0,
          final_amount: Number(raw["Final Amount"]) || 0,
          payment_method: raw["Payment Method"],
          order_status: raw["Order Status"],
          delivery_type: raw["Delivery Type"],
          store_id: raw["Store ID"],
          store_location: raw["Store Location"],
          salesperson_id: raw["Salesperson ID"],
          employee_name: raw["Employee Name"],
        };

        batch.push(row);
        if (batch.length >= BATCH_SIZE) {
          insertMany(batch);
          batch.length = 0;
        }
      })
      .on("end", () => {
        if (batch.length) insertMany(batch);
        console.log("[CSV IMPORT] Import completed.");
        resolve();
      })
      .on("error", (err) => {
        console.error("[CSV IMPORT] Error while importing:", err);
        reject(err);
      });
  });
}

module.exports = {
  importCsvIfNeeded,
};
