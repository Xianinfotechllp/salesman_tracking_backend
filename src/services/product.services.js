const Joi = require("joi");
const GenericRepo = require("../repository/genericRepository");
const productModel = require("../models/product");
const ApiError = require("../utils/ApiError");
const { validationProductSchema } = require("../utils/validator");
const mongoose = require("mongoose");
const fs = require("fs");
const cloudinary = require("../configs/cloudinary");

const createProduct = async (productData, file) => {
  const { error, value } = validationProductSchema(productData);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  try {
    if (file) {
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: "products-stas",
      });

      fs.unlinkSync(file.path);

      value.image = result.secure_url;
    }

    return await GenericRepo.create(productModel, value);
  } catch (error) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    console.log(error)
    throw new ApiError(500, "Error creating product");
  }
};

const getAllProducts = async () => {
  try {
    return await GenericRepo.getAll(productModel);
  } catch (error) {
    throw new ApiError(500, "Error fetching products");
  }
};

const getProductById = async (id) => {
  try {
    const product = await GenericRepo.getById(productModel, id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return product;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (id, productData) => {
  const { error, value } = validationProductSchema(productData);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Product ID format");
    }
    const updatedProduct = await GenericRepo.update(productModel, id, value);
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const addProductStock = async (id, quantity) => {
  const product = await GenericRepo.getById(productModel, id);
  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }
  product.stock += quantity;
  return await GenericRepo.update(productModel, id, { stock: product.stock });
};

const reduceProductStock = async (id, quantity) => {
  const product = await GenericRepo.getById(productModel, id);

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  if (quantity > product.stock) {
    throw new ApiError(
      400,
      "Cannot reduce stock below 0 or exceed available stock."
    );
  }

  product.stock -= quantity;
  return await GenericRepo.update(productModel, id, { stock: product.stock });
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await GenericRepo.remove(productModel, id);
    if (!deletedProduct) {
      throw new ApiError(404, "Product not found");
    }

    return deletedProduct;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  addProductStock,
  reduceProductStock,
  updateProduct,
  deleteProduct,
};
