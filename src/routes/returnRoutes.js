const express = require("express");
const router = express.Router();
const {
    handleCreateReturnRequest,
    handleGetAllReturns,
    handleGetReturnById,
    handleApproveReturn,
    handleRejectReturn,
    handleDeleteReturn,
    handleGetReturnHistoryBySalesman
} = require("../controllers/return.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");



router.post("/", verifyToken,handleCreateReturnRequest);
router.get("/", verifyToken, verifyAdmin, handleGetAllReturns);
router.get("/:id", handleGetReturnById);
router.get("/salesman/:id", handleGetReturnHistoryBySalesman)
router.patch("/approve/:id", verifyToken,verifyAdmin,handleApproveReturn);
router.patch("/reject/:id", verifyToken,verifyAdmin,handleRejectReturn);
router.delete("/:id", handleDeleteReturn);

module.exports = router;
