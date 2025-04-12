const expenseService = require("../services/expense.services");
const notificationService = require("../services/notification.services");

const handleAddExpense = async (req, res) => {
  try {
    const { expenseType, amount, notes, receiptURL } = req.body;
    const salesman = req.user.id;

    const newExpense = await expenseService.addExpense({
      salesman,
      expenseType,
      amount,
      notes,
      receiptURL,
    });

    return res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    return res.status(200).json({ expenses });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetExpensesBySalesmanId = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    const expenses = await expenseService.getExpensesBySalesmanId(salesmanId);
    return res.status(200).json({ expenses });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await expenseService.getExpenseById(id);
    return res.status(200).json({ expense });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleUpdateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenseType, amount, notes, receiptURL } = req.body;
    const salesman = req.user.id;

    const updatedExpense = await expenseService.updateExpense(id, {
      salesman,
      expenseType,
      amount,
      notes,
      receiptURL,
    });

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleDeleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await expenseService.deleteExpense(id);

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleApproveExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedExpense = await expenseService.updateExpenseStatus(
      id,
      "completed"
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await notificationService.createNotification({
      recipient: updatedExpense.salesman,
      recipientType: "user-stas",
      message: `Your expense for ${updatedExpense.expenseType} has been approved.`,
    });

    return res.status(200).json({
      message: "Expense approved successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleRejectExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedExpense = await expenseService.updateExpenseStatus(
      id,
      "cancelled"
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await notificationService.createNotification({
      recipient: updatedExpense.salesman,
      recipientType: "user-stas",
      message: `Your expense for ${updatedExpense.expenseType} has been rejected.`,
    });

    return res.status(200).json({
      message: "Expense rejected successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  handleAddExpense,
  handleGetAllExpenses,
  handleGetExpensesBySalesmanId,
  handleGetExpenseById,
  handleUpdateExpense,
  handleDeleteExpense,
  handleApproveExpense,
  handleRejectExpense,
};
