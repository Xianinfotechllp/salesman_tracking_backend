const express = require("express");
const {
  handleAddExpense,
  handleGetAllExpenses,
  handleGetExpensesBySalesmanId,
  handleUpdateExpense,
  handleDeleteExpense,
  handleApproveExpense,
  handleRejectExpense,
  handleGetExpenseById,
} = require("../controllers/expense.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, handleAddExpense);
router.get("/", verifyToken, verifyAdmin, handleGetAllExpenses);
router.get("/getExpense/:id",handleGetExpenseById);
router.get("/salesman/:salesmanId", handleGetExpensesBySalesmanId);
router.patch("/approve/:id",verifyToken,verifyAdmin,handleApproveExpense)
router.patch("/reject/:id",verifyToken,verifyAdmin,handleRejectExpense);
router.put("/:id", verifyToken, handleUpdateExpense);
router.delete("/:id", handleDeleteExpense);

module.exports = router;
