const { validateRewardRedemption } = require("../utils/validator");
const GenericRepo = require("../repository/genericRepository");
const Reward = require("../models/rewards");
const User = require("../models/users");
const RedemptionRequest = require("../models/redemption");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

const redeemReward = async (userId, rewardId) => {
  try {
    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);

    if (user.points < reward.pointsRequired) {
      throw new ApiError(400, "Not enough points to redeem this reward");
    }

    if (reward.quantityAvailable <= 0) {
      throw new ApiError(400, "Reward is out of stock");
    }

    user.points -= reward.pointsRequired;
    await user.save();

    const redemptionRequest = await GenericRepo.create(RedemptionRequest, {
      userId,
      rewardId,
      pointsUsed: reward.pointsRequired,
    });

    return redemptionRequest;
  } catch (error) {
    throw error;
  }
};

const approveRedemption = async (redemptionRequestId) => {
  try {
    const redemptionRequest = await GenericRepo.getById(
      RedemptionRequest,
      redemptionRequestId,
      ["userId", "rewardId"]
    );

    if (!redemptionRequest) {
      throw new ApiError(404, "Redemption request not found");
    }

    if (redemptionRequest.status !== "pending") {
      throw new ApiError(400, "Request has already been processed");
    }

    redemptionRequest.status = "approved";
    redemptionRequest.redeemedAt = new Date();
    await GenericRepo.update(RedemptionRequest, redemptionRequestId, {
      status: "approved",
      redeemedAt: new Date(),
    });

    const reward = redemptionRequest.rewardId;
    reward.quantityAvailable -= 1;
    await GenericRepo.update(Reward, reward._id, {
      quantityAvailable: reward.quantityAvailable,
    });

    return { message: "Reward redemption approved", redemptionRequest };
  } catch (error) {
    throw error;
  }
};

const rejectRedemption = async (redemptionRequestId) => {
  try {
    const redemptionRequest = await GenericRepo.getById(
      RedemptionRequest,
      redemptionRequestId,
      ["userId", "rewardId"]
    );

    if (!redemptionRequest) {
      throw new ApiError(404, "Redemption request not found");
    }

    if (redemptionRequest.status !== "pending") {
      throw new ApiError(400, "Request has already been processed");
    }

    await GenericRepo.update(RedemptionRequest, redemptionRequestId, {
      status: "rejected",
    });

    const user = redemptionRequest.userId;
    user.points += redemptionRequest.pointsUsed;
    await GenericRepo.update(User, user._id, { points: user.points });

    return { message: "Reward redemption rejected", redemptionRequest };
  } catch (error) {
    throw error;
  }
};

const getAllRedemptionRequests = async () => {
  try {
    return await RedemptionRequest.find()
      .populate({ path: "userId", select: "name" }) 
      .populate({ 
        path: "rewardId", 
        select: "rewardName pointsRequired quantityAvailable" 
      })
      .select("pointsUsed status createdAt updatedAt"); 
  } catch (error) {
    throw new Error(`Error fetching redemption requests: ${error.message}`);
  }
};



const getRedemptionRequestById = async (id) => {
  return await GenericRepo.getById(
    RedemptionRequest,
    id,
    ["userId", "rewardId"],
    "_id"
  );
};

module.exports = {
  redeemReward,
  approveRedemption,
  rejectRedemption,
  getAllRedemptionRequests,
  getRedemptionRequestById,
};
