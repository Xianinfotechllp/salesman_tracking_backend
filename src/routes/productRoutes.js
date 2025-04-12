const express = require("express");
const { 
    handleAddProduct, 
    handleGetAllProducts, 
    handleGetProductById, 
    handleUpdateProduct, 
    handleDeleteProduct, 
    handleAddProductStock,
    handleReduceProductStock
} = require("../controllers/product.controller");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/",upload.single('image'), handleAddProduct);
router.get("/", handleGetAllProducts);
router.get("/:id", handleGetProductById);
router.put("/:id", handleUpdateProduct);
router.patch("/add-stock/:id",handleAddProductStock);
router.patch("/reduce-stock/:id",handleReduceProductStock);
router.delete("/:id", handleDeleteProduct);

module.exports = router;
