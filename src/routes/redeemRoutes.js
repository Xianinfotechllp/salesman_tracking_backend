const express = require("express");
const router = express.Router();
const { 
    handleCreateRedemptionRequest,
    handleApproveRedemptionRequest,
    handleGetAllRedemptionRequests,
    handleGetRedemptionRequestById,
    handleRejectRedemptionRequest,
    handleGetRedemptionStats
 } = require("../controllers/redemption.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

router.post("/", handleCreateRedemptionRequest);
router.get("/",verifyToken,verifyAdmin, handleGetAllRedemptionRequests);
router.get("/reports",handleGetRedemptionStats);
router.get("/:id", handleGetRedemptionRequestById);
router.patch("/approve/:id",verifyToken,verifyAdmin, handleApproveRedemptionRequest);
router.patch("/reject/:id",verifyToken,verifyAdmin, handleRejectRedemptionRequest);

module.exports = router;
