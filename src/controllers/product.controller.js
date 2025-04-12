const productModel = require("../models/product");
const productService = require("../services/product.services");
const ApiError = require("../utils/ApiError");


const handleAddProduct = async (req, res) => {
  const productData = req.body;
  const file = req.file;
  console.log(productData)
  try {
    const newProduct = await productService.createProduct(productData,file);
    return res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id);
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleAddProductStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    if (!quantity || quantity <= 0) {
      throw new ApiError(400, "Invalid quantity provided");
    }
    const updatedProduct = await productService.addProductStock(id, quantity);
    return res.status(200).json({
      message: "Product Stock Added successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleReduceProductStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const updatedProduct = await productService.reduceProductStock(
      id,
      quantity
    );
    return res.status(200).json({
      message: "Product Stock Reduced successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleUpdateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  try {
    const updatedProduct = await productService.updateProduct(id, productData);
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleDeleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await productService.deleteProduct(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  handleAddProduct,
  handleGetAllProducts,
  handleGetProductById,
  handleAddProductStock,
  handleReduceProductStock,
  handleUpdateProduct,
  handleDeleteProduct,
};
