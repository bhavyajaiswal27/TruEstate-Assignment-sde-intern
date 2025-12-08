// src/controllers/salesController.js
const { salesServices } = require("../services");

async function getSales(req, res, next) {
  try {
    const result = await salesServices.getSales(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getTags(req, res, next) {
  try {
    const tags = salesServices.getAllTags();
    res.json({ tags });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSales,
  getTags,
};
