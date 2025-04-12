const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

//Not implemented yet
const login = async(model,type)=>{
  try {
    switch (type) {
      case "user":
        handleUserLogin()
        break;
      case "admin":
        handleAdminLogin()
      default:
        break;
    }
  } catch (error) {
    
  }
}

const getAll = async (model, populateOptions = []) => {
  try {
    return await model.find();
  } catch (error) {
    throw new Error(`Error fetching all records: ${error.message}`);
  }
};

const getById = async (model, id, populateOptions = [], field = "_id") => {
  const query = { [field]: id };
  try {

    if(!id){
      throw new ApiError(400,"ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ID format");
    }

    const document = await model.findOne(query).populate(populateOptions);

    if (!document) {
      throw new ApiError(404, "Record not found");
    }

    return document;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Error fetching record");
  }
};

const getByField = async (model, field, value, populateOptions = []) => {
  console.log(`Querying for ${field}: ${value}`);

  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, "Invalid ID format");
  }

  const query = { [field]: value };

  try {
    const documents = await model.find(query).populate(populateOptions);
    console.log("DOCS:",documents)
    if (!documents || documents.length === 0) {
      throw new ApiError(404, "Record not found");
    }

    return documents;
  } catch (error) {
    console.error(`Error fetching records for ${field}: ${value}`, error);
    throw new ApiError(500, "Error fetching records by field");
  }
};

const create = async (model, data) => {
  try {
    const newRecord = new model(data);
    return await newRecord.save();
  } catch (error) {
    throw new Error(`Error creating record: ${error.message}`);
  }
};

const update = async (model, id, updateData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ID format");
    }

    const updatedRecord = await model.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedRecord) {
      throw new ApiError(404, `Record with ID ${id} not found for update`);
    }
    return updatedRecord;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error updating record");
  }
};

const remove = async (model, id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ID format");
    }
    const deletedRecord = await model.findByIdAndDelete(id);
    if (!deletedRecord) {
      throw new ApiError(404, `Record with ID ${id} not found for deletion`);
    }
    return deletedRecord;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Error deleting record: ${error.message}`);
  }
};

module.exports = {
  getAll,
  getById,
  getByField,
  create,
  update,
  remove,
};
