const agenda = require("../configs/agenda");
const { createNotification } = require("../services/notification.services");
const meetingModel = require("../models/meeting")

agenda.define("send-follow-up-notification", async (job) => {
  try {
    console.log("🚀 Job triggered: send-follow-up-notification");

    const meetingId = job.attrs.data?.meetingId || "Missing";
    const userId = job.attrs.data?.userId || "Missing";

    console.log("📅 Meeting ID:", meetingId);
    console.log("👤 Salesman/User ID:", userId);
    console.log("⏰ Executed At:", new Date().toISOString());

    if (!userId || userId === "Missing") {
      throw new Error(
        "User ID is missing or invalid, notification cannot be created."
      );
    }

    const meeting = await meetingModel.findById(meetingId).populate("client");

    const clientName = meeting.client?.name 

    await createNotification({
      recipient: userId,
      recipientType: "user-stas",
      message: `Reminder: Follow-up required for meeting with: ${clientName}`,
    });

    console.log("🔔 Follow-up reminder notification sent!");
  } catch (error) {
    console.error("❌ Error in send-follow-up-notification job:", error);
  }
});
