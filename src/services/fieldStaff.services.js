const fieldStaffModel = require("../models/fieldStaff");
const GenericRepo = require("../repository/genericRepository");
const ApiError = require("../utils/ApiError");
const { validateFieldStaffSchema } = require("../utils/validator");
const mongoose = require("mongoose");

const addFieldStaff = async (staffData) => {
  try {
    const { error, value } = validateFieldStaffSchema(staffData);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const newStaff = await GenericRepo.create(fieldStaffModel, value);
    return newStaff;
  } catch (error) {
    throw error;
  }
};

const getAllFieldStaff = async () => {
  try {
    const fieldStaff = await GenericRepo.getAll(fieldStaffModel);

    if (fieldStaff.length === 0) {
      throw new ApiError(404, "No field staff found");
    }

    return fieldStaff;
  } catch (error) {
    throw error;
  }
};

const getFieldStaffById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid field staff ID format");
  }

  try {
    const staff = await GenericRepo.getById(fieldStaffModel, id);
    if (!staff) {
      throw new ApiError(404, "Field staff not found");
    }
    return staff;
  } catch (error) {
    throw error;
  }
};

const updateFieldStaff = async (id, staffData) => {
  try {
    const updatedStaff = await GenericRepo.update(
      fieldStaffModel,
      id,
      staffData
    );
    if (!updatedStaff) {
      throw new ApiError(404, "Field staff not found");
    }
    return updatedStaff;
  } catch (error) {
    throw error;
  }
};

const removeFieldStaff = async (id) => {
  try {
    const deletedStaff = await GenericRepo.remove(fieldStaffModel, id);
    if (!deletedStaff) {
      throw new ApiError(404, "Field staff not found");
    }
    return deletedStaff;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addFieldStaff,
  getAllFieldStaff,
  getFieldStaffById,
  updateFieldStaff,
  removeFieldStaff,
};
