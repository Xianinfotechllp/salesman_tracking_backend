const mongoose = require("mongoose");

const meetingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    salesman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user-stas",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    locationType: {
      type: String,
      enum: ["On-Site", "Virtual"],
      required: true,
    },
    locationDetails: {
      type: String,
      required: true,
    },
    fieldStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field-Staff",
      required: true,
    }, // Changed from array to single ObjectId
    agenda: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    attachment: {
      type: String,
    },
    repeatFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", null],
      default: null,
    },
    followUpReminder: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
