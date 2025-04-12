const { validateRewardsSchema } = require("../utils/validator");
const GenericRepo = require("../repository/genericRepository");
const Rewards = require("../models/rewards");
const ApiError = require("../utils/ApiError");
const Redemption = require("../models/redemption");
const mongoose = require("mongoose");

const createReward = async (rewardData) => {
  try {
    const { error, value } = validateRewardsSchema(rewardData);
    if (error) {
      throw new ApiError(400, error.message);
    }

    return await GenericRepo.create(Rewards, rewardData);
  } catch (error) {
    throw error;
  }
};

const getAllRewards = async () => {
  return await GenericRepo.getAll(Rewards);
};

const getRewardById = async (id) => {
  return await GenericRepo.getById(Rewards, id);
};

const updateReward = async (id, rewardsData) => {
  try {
    const updateReward = await GenericRepo.update(Rewards, id, rewardsData);
    return updateReward;
  } catch (error) {
    throw error;
  }
};

const deleteRewards = async (id) => {
  return await GenericRepo.remove(Rewards, id);
};

const getUserRewardHistory = async (userId) => {
  try {
    // Convert userId to ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const rewardHistory = await Redemption
      .find({ userId: objectIdUserId }) // Query using ObjectId
      .populate({
        path: "rewardId",
        select: "rewardName pointsRequired rewardImageURL",
      })
      .populate({
        path: "userId",
        select: "name",
      })
      .select("rewardId userId pointsUsed status redeemedAt")
      .lean();

    if (!rewardHistory || rewardHistory.length === 0) {
      throw new Error("No redemption request found for this user");
    }

    return rewardHistory;
  } catch (error) {
    console.error("Error fetching reward history:", error);
    throw error;
  }
};

module.exports = {
  createReward,
  getAllRewards,
  getRewardById,
  updateReward,
  deleteRewards,
  getUserRewardHistory,
};
