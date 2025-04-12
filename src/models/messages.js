const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user-stas", 
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user-stas", 
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
