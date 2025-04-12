const agenda = require("../configs/agenda");
const Meeting = require("../models/meeting");
const { createNotification } = require("../services/notification.services"); 

agenda.define("repeat-meeting-notification", async (job) => {
  try {
    const { userId, meetingId, frequency } = job.attrs.data;

    console.log(
      `🔄 Sending repeat meeting notification for meeting ${meetingId} to user ${userId} - Frequency: ${frequency}`
    );

    
    const meeting = await Meeting.findById(meetingId).populate("client");
    if (!meeting) {
      console.error("❌ Meeting not found:", meetingId);
      return;
    }

    if (!userId) {
      console.error("❌ User ID is missing, cannot send notification.");
      return;
    }

    const clientName = meeting.client?.name || "Unknown Client"; 

    
    await createNotification({
      recipient: userId,
      recipientType: "user-stas",
      message: `🔄 Reminder: Your meeting with **${clientName}** is scheduled to repeat (${frequency}).`,
    });

    console.log("🔔 Repeat meeting reminder notification sent!");
  } catch (error) {
    console.error("❌ Error in repeat-meeting-notification job:", error);
  }
});

