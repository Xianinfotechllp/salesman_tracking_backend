const express = require("express");
const router = express.Router();
const {
  handleCreateOrder,
  handleGetAllOrders,
  handleGetOrdersBySalesman,
  handleGetOrderById,
  handleUpdateOrderStatus,
  handleDeleteOrder,
  HandleEditOrder,
} = require("../controllers/order.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

router.post("/", handleCreateOrder);
router.get("/", verifyToken, verifyAdmin, handleGetAllOrders);
router.get("/salesman/:salesmanId", handleGetOrdersBySalesman);
router.get("/:id", handleGetOrderById);
router.put("/status/:id", handleUpdateOrderStatus);
router.put("/editOrder/:id", verifyToken, verifyAdmin, HandleEditOrder);
router.delete("/:id", verifyToken, verifyAdmin, handleDeleteOrder);

module.exports = router;
