const express = require("express");
const router = express.Router();
const {
  handleCreateReward,
  handleGetAllRewards,
  handleGetRewardById,
  handleDeleteReward,
  handleGetUserRewardHistory,
  handleUpdateReward,
} = require("../controllers/rewards.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

router.get("/history/:id", handleGetUserRewardHistory);
router.post("/", verifyToken, verifyAdmin, handleCreateReward);
router.get("/", handleGetAllRewards);
router.get("/:id", handleGetRewardById);
router.put("/update/:id", verifyToken, verifyAdmin, handleUpdateReward);
router.delete("/:id", verifyToken, verifyAdmin, handleDeleteReward);

module.exports = router;
