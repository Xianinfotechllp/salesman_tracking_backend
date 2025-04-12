const ApiError = require("../utils/ApiError");
const GenericRepo = require("../repository/genericRepository");
const expenseTypeModel = require("../models/expenseType");
const mongoose = require("mongoose");

const addExpenseType = async (data) => {
  try {
    if (!data.name) {
      throw new ApiError(400, "Expense type name is required");
    }
    const existingType = await expenseTypeModel.findOne({ name: data.name });

    if (existingType) {
      throw new ApiError(400, "Expense type already exists");
    }

    const newType = new expenseTypeModel(data);
    return await GenericRepo.create(expenseTypeModel, newType);
  } catch (error) {
    throw error;
  }
};

const getAllExpenseTypes = async () => {
  try {
    const expenseTypes = await GenericRepo.getAll(expenseTypeModel);

    if (!expenseTypes || expenseTypes.length === 0) {
      throw new ApiError(404, "No expense types available");
    }

    return expenseTypes;
  } catch (error) {
    throw error;
  }
};

const getExpenseTypeById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid expense type ID format");
    }
    const expenseType = await GenericRepo.getById(expenseTypeModel, id);
    if (!expenseType) {
      throw new ApiError(404, "Expense type not found");
    }
    return expenseType;
  } catch (error) {
    throw error;
  }
};

const updateExpenseType = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid expense type ID format");
    }
    const updatedExpenseType = await GenericRepo.update(
      expenseTypeModel,
      id,
      data
    );
    if (!updatedExpenseType) {
      throw new ApiError(404, "Expense type not found");
    }
    return updatedExpenseType;
  } catch (error) {
    throw error;
  }
};

const deleteExpenseType = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid expense type ID format");
    }
    const deletedExpenseType = await GenericRepo.remove(expenseTypeModel, id);
    if (!deletedExpenseType) {
      throw new ApiError(404, "Expense type not found");
    }
    return deletedExpenseType;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addExpenseType,
  getAllExpenseTypes,
  getExpenseTypeById,
  updateExpenseType,
  deleteExpenseType,
};
