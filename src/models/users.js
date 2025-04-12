const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
  },
  accountProvider: {
    type: String,
    enum: ["google", "facebook", "local"],
    required: true,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  points: {
    type: Number,
    default: 0, 
  },
});

const userModel = mongoose.model("user-stas", userSchema);

module.exports = userModel;
