const express = require("express");
const router = express();
const {
  handleAddExpenseType,
  handleDeleteExpenseType,
  handleGetAllExpenseTypes,
  handleGetExpenseTypeById,
  handleUpdateExpenseType,
} = require("../controllers/expenseType.controller");

router.post("/",handleAddExpenseType);
router.get("/",handleGetAllExpenseTypes);
router.get("/:id",handleGetExpenseTypeById);
router.put("/:id",handleUpdateExpenseType);
router.delete("/:id",handleDeleteExpenseType);

module.exports = router;