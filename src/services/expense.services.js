const { validateExpenseSchema,validateUpdateExpenseSchema } = require("../utils/validator");
const ApiError = require("../utils/ApiError");
const GenericRepo = require("../repository/genericRepository");
const expenseModel = require("../models/expense");
const User = require("../models/users");
const mongoose = require("mongoose");

const addExpense = async (expenseData) => {
  try {
    const { error, value } = validateExpenseSchema(expenseData);
    if (error) {
      throw new ApiError(400, error.message);
    }
    const { salesman, amount, notes, receiptURL } = value;

    if (!mongoose.Types.ObjectId.isValid(salesman)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    const userExists = await GenericRepo.getById(User, salesman);
    if (!userExists) {
      throw new ApiError(404, "Salesman not found");
    }

    const newExpense = new expenseModel(value);
    return await GenericRepo.create(expenseModel, newExpense);
  } catch (error) {
    throw error;
  }
};

const getAllExpenses = async () => {
  try {
    return await GenericRepo.getAll(expenseModel);
  } catch (error) {
    throw new ApiError(500, `Error fetching expenses: ${error.message}`);
  }
};

const getExpensesBySalesmanId = async (salesmanId) => {
  try {
    
    if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    
    const salesmanWithExpenses = await User.findById(salesmanId)
      .select("name _id") 
      .lean(); 

    if (!salesmanWithExpenses) {
      throw new ApiError(404, "Salesman not found");
    }

    
    const expenses = await expenseModel.find({ salesman: salesmanId })
      .select("-__v") 
      .lean();

    if (!expenses.length) {
      throw new ApiError(404, "No expenses found for this salesman");
    }

    
    return {
      salesman: salesmanWithExpenses,
      expenses: expenses,
    };
  } catch (error) {
    throw error;
  }
};

const updateExpense = async (id, expenseData) => {
  try {

    const updatedExpense = await GenericRepo.update(
      expenseModel,
      id,
      expenseData
    );
    return updatedExpense;
  } catch (error) {
    throw error;
  }
};

const deleteExpense = async (id) => {
  try {
    return await GenericRepo.remove(expenseModel, id);
  } catch (error) {
    throw error;
  }
};

const updateExpenseStatus = async (id, status) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid expense ID format");
    }

    const validStatuses = ["pending", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const updatedExpense = await GenericRepo.update(expenseModel, id, { status });
    if (!updatedExpense) {
      throw new ApiError(404, "Expense not found");
    }

    return updatedExpense;
  } catch (error) {
    throw error;
  }
};

const getExpenseById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid expense ID format");
    }

    const expense = await expenseModel
      .findById(id)
      .populate("salesman","name")
      .populate("expenseType")
      .populate("notes")
      .populate("receiptURL")
      .populate("status")
      .select("-__v");

    if (!expense) {
      throw new ApiError(404, "Expense not found");
    }

    return expense;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  addExpense,
  getAllExpenses,
  getExpensesBySalesmanId,
  getExpenseById,
  updateExpense,
  deleteExpense,
  updateExpenseStatus
};
