// src/server.js
require('dotenv').config({ path: '.env.txt' });

const express = require('express');
const cors = require('cors');
const { importCsvIfNeeded } = require("./utils/csvImporter");
const salesRoutes = require('./routes/salesRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sales", salesRoutes);

// Optional health check route for Render
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Error handler (keep this after routes)
app.use(errorHandler);

// ✅ Start server immediately
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // ✅ Run CSV import in the background (non-blocking)
  importCsvIfNeeded()
    .then(() => {
      console.log("[CSV IMPORT] Completed successfully");
    })
    .catch((err) => {
      console.error("[CSV IMPORT] Failed:", err);
      // ⚠️ Don't call process.exit() on Render, just log
    });
});
