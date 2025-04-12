const expenseTypeService = require("../services/expenseType.services");

const handleAddExpenseType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newExpenseType = await expenseTypeService.addExpenseType({
      name,
      description,
    });

    return res.status(201).json({
      message: "Expense type added successfully",
      expenseType: newExpenseType,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetAllExpenseTypes = async (req, res) => {
  try {
    const expenseTypes = await expenseTypeService.getAllExpenseTypes();
    return res.status(200).json({ expenseTypes });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetExpenseTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const expenseType = await expenseTypeService.getExpenseTypeById(id);
    return res.status(200).json({ expenseType });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleUpdateExpenseType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedExpenseType = await expenseTypeService.updateExpenseType(id, {
      name,
      description,
    });

    return res.status(200).json({
      message: "Expense type updated successfully",
      expenseType: updatedExpenseType,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleDeleteExpenseType = async (req, res) => {
  try {
    const { id } = req.params;

    await expenseTypeService.deleteExpenseType(id);

    return res
      .status(200)
      .json({ message: "Expense type deleted successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  handleAddExpenseType,
  handleGetAllExpenseTypes,
  handleGetExpenseTypeById,
  handleUpdateExpenseType,
  handleDeleteExpenseType,
};
