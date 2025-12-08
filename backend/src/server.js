// src/server.js
require('dotenv').config({ path: '.env.txt' });

const express = require('express');
const cors = require('cors');
const { importCsvIfNeeded } = require("./utils/csvImporter");
const { initDatabase } = require('./config/database');
const salesRoutes = require('./routes/salesRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/sales", salesRoutes);

// run import once, then start server
importCsvIfNeeded()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database from CSV:", err);
    process.exit(1);
  });

