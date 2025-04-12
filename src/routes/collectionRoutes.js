const express = require("express");
const router = express.Router();
const {
    handleAddCollection,
    handleGetAllCollections,
    handleGetCollectionsBySalesmanId,
    handleUpdateCollection,
    handleDeleteCollection,
    handleGetCollectionById
} = require("../controllers/collection.controller");


router.post("/", handleAddCollection);
router.get("/", handleGetAllCollections);
router.get("/salesman/:salesmanId", handleGetCollectionsBySalesmanId);
router.get("/collection/:collectionId",handleGetCollectionById);
router.put("/:id", handleUpdateCollection);
router.delete("/:id", handleDeleteCollection);

module.exports = router;
