const mongoose = require("mongoose");

const redemptionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user-stas", // Referencing the User model
      required: true,
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rewards", // Referencing the Rewards model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    pointsUsed: {
      type: Number,
      required: true,
    },
    redeemedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const redemptionModel = mongoose.model("redemptionRequests", redemptionSchema);

module.exports = redemptionModel;
