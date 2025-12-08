// src/routes/salesRoutes.js
const express = require("express");
const router = express.Router();
const { getSales, getTags } = require("../controllers/salesController");

router.get("/", getSales);       // /api/sales
router.get("/tags", getTags);    // /api/sales/tags

module.exports = router;
