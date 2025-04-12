const express = require("express");
const router = express.Router();
const {
  handleGetPerformanceAnalytics,
  handleGetSalesPerformanceAnalytics,
  handleGetAttendanceAnalytics,
} = require("../controllers/performance.controller");

router.get("/dashboard", handleGetPerformanceAnalytics);
router.get("/sales", handleGetSalesPerformanceAnalytics);
router.get("/attendance", handleGetAttendanceAnalytics);

module.exports = router;
