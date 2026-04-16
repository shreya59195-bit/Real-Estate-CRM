// @ts-nocheck
const express = require("express");
const router = express.Router();

const {
  createDeal,
  getDeals,
  updateDeal,
  deleteDeal,
} = require("../controllers/dealController");

router.get("/", getDeals);
router.post("/", createDeal);
router.put("/:id", updateDeal);
router.delete("/:id", deleteDeal);

module.exports = router;