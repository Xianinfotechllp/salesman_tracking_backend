const meetingModel = require("../models/meeting");
const GenericRepo = require("../repository/genericRepository");
const ApiError = require("../utils/ApiError");
const { validateMeetingSchema } = require("../utils/validator");
const User = require("../models/users");
const Client = require("../models/client");
const FieldStaff = require("../models/fieldStaff");
const userModel = require("../models/users");
const mongoose = require("mongoose");
const agenda = require("../configs/agenda");

const scheduleMeeting = async (meetingData) => {
  try {
    const { error, value } = validateMeetingSchema(meetingData);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const { salesman, client, fieldStaff, repeatFrequency, followUpReminder } =
      value;

    if (!mongoose.Types.ObjectId.isValid(salesman)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    // Find client by name
    const clientExists = await Client.findOne({ name: client });
    if (!clientExists) throw new ApiError(404, "Client not found");

    // Find field staff by name
    const fieldStaffDoc = await FieldStaff.findOne({ name: fieldStaff });

    if (!fieldStaffDoc) {
      throw new ApiError(404, `Field Staff member "${fieldStaff}" not found`);
    }

    const userExists = await GenericRepo.getById(User, salesman);
    if (!userExists) throw new ApiError(404, "Salesman not found");

    const newMeeting = await GenericRepo.create(meetingModel, {
      ...value,
      client: clientExists._id,
      fieldStaff: fieldStaffDoc._id, // Assigning the single field staff ID
    });

    if (followUpReminder) {
      try {
        console.log("📌 Scheduling follow-up reminder...");
        console.log(
          "📅 Reminder Time:",
          new Date(followUpReminder).toISOString()
        );

        await agenda.schedule(
          new Date(followUpReminder),
          "send-follow-up-notification",
          {
            meetingId: newMeeting._id,
            userId: newMeeting.salesman,
          }
        );

        console.log("✅ Follow-up reminder scheduled successfully!");
      } catch (error) {
        console.error("❌ Failed to schedule follow-up reminder:", error);
      }
    }

    if (repeatFrequency) {
      let repeatInterval;
      if (repeatFrequency === "daily") repeatInterval = "1 day";
      else if (repeatFrequency === "weekly") repeatInterval = "1 week";
      else if (repeatFrequency === "monthly") repeatInterval = "1 month";

      try {
        console.log(
          `🔄 Scheduling recurring meeting notification every ${repeatInterval}...`
        );

        const nextMeetingDate = new Date(newMeeting.date);
        if (repeatFrequency === "daily")
          nextMeetingDate.setDate(nextMeetingDate.getDate() + 1);
        else if (repeatFrequency === "weekly")
          nextMeetingDate.setDate(nextMeetingDate.getDate() + 7);
        else if (repeatFrequency === "monthly")
          nextMeetingDate.setMonth(nextMeetingDate.getMonth() + 1);

        await agenda.schedule(nextMeetingDate, "repeat-meeting-notification", {
          meetingId: newMeeting._id,
          userId: newMeeting.salesman,
          frequency: repeatFrequency,
        });

        console.log(
          "✅ Recurring meeting notification scheduled successfully!"
        );
      } catch (error) {
        console.error(
          "❌ Failed to schedule recurring meeting notification:",
          error
        );
      }
    }

    return newMeeting;
  } catch (error) {
    console.error("❌ Error in scheduling meeting:", error);
    throw error;
  }
};

const getAllMeetings = async () => {
  try {
    return await GenericRepo.getAll(meetingModel, ["salesman", "client"]);
  } catch (error) {
    throw new ApiError(500, `Error fetching meetings: ${error.message}`);
  }
};

const getMeetingById = async (id) => {
  try {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid meeting ID format");
    }

    const meeting = await meetingModel.findById(id).populate("salesman client fieldStaff");

    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }

    return meeting;
  } catch (error) {
    throw error;
  }
};

const getMeetingsBySalesman = async (salesmanId) => {
  if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
    throw new ApiError(400, "Invalid salesman ID format");
  }
  const userExists = await userModel.findById(salesmanId);
  if (!userExists) {
    throw new ApiError(404, "Salesman not found");
  }
  try {
    const meetings = await GenericRepo.getByField(
      meetingModel,
      "salesman",
      salesmanId,
      ["salesman", "client"]
    );
    if (!meetings.length) {
      throw new ApiError(404, "No meetings found for this salesman");
    }
    return meetings;
  } catch (error) {
    throw error;
  }
};

const updateMeeting = async (id, meetingData) => {
  try {
    const updatedMeeting = await GenericRepo.update(
      meetingModel,
      id,
      meetingData
    );
    if (!updatedMeeting) {
      throw new ApiError(404, "Meeting not found");
    }

    return updatedMeeting;
  } catch (error) {
    throw error;
  }
};

const cancelMeeting = async (id) => {
  try {
    const deletedMeeting = await GenericRepo.remove(meetingModel, id);
    if (!deletedMeeting) {
      throw new ApiError(404, "Meeting not found");
    }
    return deletedMeeting;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  scheduleMeeting,
  getAllMeetings,
  getMeetingById,
  getMeetingsBySalesman,
  updateMeeting,
  cancelMeeting,
};
