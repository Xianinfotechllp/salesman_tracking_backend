const rewardService = require("../services/rewards.services");

const handleCreateReward = async (req, res) => {
  try {
    const reward = await rewardService.createReward(req.body);
    return res.status(201).json({ message: "Reward created successfully", reward });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetAllRewards = async (req, res) => {
  try {
    const rewards = await rewardService.getAllRewards();
    return res.status(200).json({ rewards });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetRewardById = async (req, res) => {
  try {
    const { id } = req.params;
    const reward = await rewardService.getRewardById(id);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }
    return res.status(200).json({ reward });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleUpdateReward = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReward = await rewardService.updateReward(id, req.body);
    if (!updatedReward) {
      return res.status(404).json({ message: "Reward not found" });
    }
    return res.status(200).json({ message: "Reward updated successfully", reward: updatedReward });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleDeleteReward = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReward = await rewardService.deleteRewards(id);
    if (!deletedReward) {
      return res.status(404).json({ message: "Reward not found" });
    }
    return res.status(200).json({ message: "Reward deleted successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetUserRewardHistory = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Correct extraction
    console.log("Received userId:", id); // Debugging Output
    console.log("Type of userId:", typeof id);

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const history = await rewardService.getUserRewardHistory(id);
    res.status(200).json({ rewardHistory: history });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  handleCreateReward,
  handleGetAllRewards,
  handleGetRewardById,
  handleUpdateReward,
  handleDeleteReward,
  handleGetUserRewardHistory
};
