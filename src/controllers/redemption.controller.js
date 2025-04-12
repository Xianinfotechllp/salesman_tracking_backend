const redemptionService = require("../services/redeem.services");
const RedemptionRequest = require("../models/redemption");
const notificationService = require("../services/notification.services");

const handleCreateRedemptionRequest = async (req, res) => {
  try {
    const { userId, rewardId } = req.body;
    const newRedemptionRequest = await redemptionService.redeemReward(
      userId,
      rewardId
    );

    await notificationService.createNotification({
      recipient: null,
      recipientType: "testadmin",
      message: `New Redemption Request by Salesman ${userId} for request ID: ${newRedemptionRequest._id}`,
    });

    return res.status(201).json({
      message: "Redemption request created successfully",
      redemptionRequest: newRedemptionRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleApproveRedemptionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedRedemptionRequest = await redemptionService.approveRedemption(
      id
    );

    await notificationService.createNotification({
      recipient: approvedRedemptionRequest.redemptionRequest.userId._id,
      recipientType: "user-stas",
      message: `Your redemption request for ${approvedRedemptionRequest.redemptionRequest.rewardId.rewardName} has been approved.`,
    });

    return res.status(200).json({
      message: "Redemption request approved successfully",
      redemptionRequest: approvedRedemptionRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleRejectRedemptionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const rejectedRedemptionRequest = await redemptionService.rejectRedemption(
      id
    );

    await notificationService.createNotification({
      recipient: rejectedRedemptionRequest.redemptionRequest.userId._id,
      recipientType: "user-stas",
      message: `Your redemption request for ${rejectedRedemptionRequest.redemptionRequest.rewardId.rewardName} has been rejected.`,
    });

    return res.status(200).json({
      message: "Redemption request rejected successfully",
      redemptionRequest: rejectedRedemptionRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleGetAllRedemptionRequests = async (req, res) => {
  try {
    const redemptionRequests =
      await redemptionService.getAllRedemptionRequests();
    return res.status(200).json({
      redemptionRequests,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleGetRedemptionRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const redemptionRequest = await redemptionService.getRedemptionRequestById(
      id
    );
    return res.status(200).json({
      redemptionRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleGetRedemptionStats = async (req, res) => {
  try {
    const result = await RedemptionRequest.aggregate([
      {
        $facet: {
          totalPointsDistributed: [
            {
              $group: {
                _id: null,
                totalPoints: { $sum: "$pointsUsed" },
              },
            },
          ],
          totalRewardsRedeemed: [
            { $match: { status: "approved" } },
            {
              $group: {
                _id: null,
                redeemedPoints: { $sum: "$pointsUsed" },
              },
            },
          ],
          pendingApprovals: [
            { $match: { status: "pending" } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalPointsDistributed: {
            $ifNull: [
              { $arrayElemAt: ["$totalPointsDistributed.totalPoints", 0] },
              0,
            ],
          },
          totalRewardsRedeemed: {
            $ifNull: [
              { $arrayElemAt: ["$totalRewardsRedeemed.redeemedPoints", 0] },
              0,
            ],
          },
          pendingApprovals: {
            $ifNull: [{ $arrayElemAt: ["$pendingApprovals.count", 0] }, 0],
          },
        },
      },
    ]);

    return res.status(200).json({
      message: "Redemption stats fetched successfully",
      totalPointsDistributed: result[0].totalPointsDistributed,
      totalRewardsRedeemed: result[0].totalRewardsRedeemed,
      pendingApprovals: result[0].pendingApprovals,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Error fetching redemption stats",
      error: error.message,
    });
  }
};

module.exports = {
  handleCreateRedemptionRequest,
  handleApproveRedemptionRequest,
  handleRejectRedemptionRequest,
  handleGetAllRedemptionRequests,
  handleGetRedemptionRequestById,
  handleGetRedemptionStats,
};
