const mongoose = require("mongoose");

const rewardSchema = mongoose.Schema(
  {
    rewardName: {
      type: String,
      required: true,
    },
    description:{
      type:String,
      
    },
    pointsRequired: {
      type: Number,
      required: true,
    },
    quantityAvailable: {
      type: Number,
      required: true,
    },
    rewardImageURL: { 
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const rewardModel = mongoose.model("rewards", rewardSchema);

module.exports = rewardModel;
