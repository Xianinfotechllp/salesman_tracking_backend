const { validateReturnSchema } = require("../utils/validator");
const GenericRepo = require("../repository/genericRepository");
const Return = require("../models/return");
const User = require("../models/users");
const Client = require("../models/client");
const Product = require("../models/product");
const ApiError = require("../utils/ApiError");
const notificationService = require("../services/notification.services");
const mongoose = require("mongoose");

const createReturnRequest = async (returnData) => {
  try {
    const { error, value } = validateReturnSchema(returnData);
    if (error) {
      throw new ApiError(400, error.message);
    }

    const { salesman, client, product } = value;

    if (!mongoose.Types.ObjectId.isValid(salesman)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }
    if (!mongoose.Types.ObjectId.isValid(client)) {
      throw new ApiError(400, "Invalid client ID format");
    }
    if (!mongoose.Types.ObjectId.isValid(product)) {
      throw new ApiError(400, "Invalid product ID format");
    }

    const [userExists, clientExists, productExists] = await Promise.all([
      User.findById(salesman),
      Client.findById(client),
      Product.findById(product),
    ]);

    if (!userExists) {
      throw new ApiError(404, "Salesman not found");
    }
    if (!clientExists) {
      throw new ApiError(404, "Client not found");
    }
    if (!productExists) {
      throw new ApiError(404, "Product not found");
    }

    return await GenericRepo.create(Return, value);
  } catch (error) {
    throw error;
  }
};

const getAllReturns = async () => {
  try {
    return await Return.find()
      .populate({
        path: "salesman",
        select: "name",
      })
      .populate({
        path: "client",
        select: "name",
      })
      .populate({
        path: "product",
        select: "name",
      })
      .select("quantity reason status salesman client product"); 
  } catch (error) {
    throw new Error(`Error fetching return records: ${error.message}`);
  }
};



const getReturnById = async (id) => {
  try {
    return await GenericRepo.getById(Return, id);
  } catch (error) {
    throw error;
  }
};

const updateReturnStatus = async (id, status) => {
  try {
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const returnRequest = await Return.findById(id);
    if (!returnRequest) {
      throw new ApiError(404, "Return request not found");
    }
 
    if (status === "approved") {
      const product = await Product.findById(returnRequest.product);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      product.stock += returnRequest.quantity;
      await product.save();
    }

    
    return await GenericRepo.update(Return, id, { status });
  } catch (error) {
    throw error;
  }
};

const deleteReturnRequest = async (id) => {
  try {
    return await GenericRepo.remove(Return, id);
  } catch (error) {
    throw error;
  }
};

const getReturnHistoryBySalesman = async (salesmanId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    const userExists = await User.findById(salesmanId);
    if (!userExists) {
      throw new ApiError(404, "Salesman not found");
    }

    return await Return.find({ salesman: salesmanId });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createReturnRequest,
  getAllReturns,
  getReturnById,
  updateReturnStatus,
  deleteReturnRequest,
  getReturnHistoryBySalesman,
};
