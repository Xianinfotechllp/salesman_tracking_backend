const cron = require("node-cron");
const clientModel = require("../models/client");
const userModel = require("../models/users");
const collectionModel = require("../models/collection");
const notificationService = require("../services/notification.services");

const notifyOutstandingDues = async () => {
  try {
    console.log("🔄 Running outstanding dues notification job...");

    // Fetch clients with outstanding dues
    const clientsWithDues = await clientModel.find({
      outstandingDue: { $gt: 0 },
    });

    if (clientsWithDues.length === 0) {
      console.log("✅ No outstanding dues found.");
      return;
    }

    // Loop through each client with outstanding dues
    for (const client of clientsWithDues) {
      console.log(
        `🔍 Scanning client: ${client.name} with due ₹${client.outstandingDue}`
      );

      // Find the corresponding collection entry to get the salesman
      const collection = await collectionModel.findOne({ client: client._id });

      if (!collection) {
        console.warn(
          `⚠️ No collection entry found for client ${client.name}. Skipping.`
        );
        continue;
      }

      // Fetch the salesman for this client
      const salesman = await userModel.findById(collection.salesman);

      if (!salesman) {
        console.warn(
          `⚠️ No salesman found for client ${client.name}. Skipping.`
        );
        continue;
      }

      // Send notification for outstanding dues
      await notificationService.createNotification({
        recipient: salesman._id,
        recipientType: "user-stas",
        message: `Reminder: Client ${client.name} has an outstanding due of ₹${client.outstandingDue}.`,
      });

      console.log(
        `📩 Notification sent to salesman: ${salesman.name} for client: ${client.name}`
      );
    }

    console.log("✅ Outstanding dues notification job completed.");
  } catch (error) {
    console.error("❌ Error in outstanding dues job:", error);
  }
};


cron.schedule("0 0 * * *", notifyOutstandingDues, {
  scheduled: true,
  timezone: "Asia/Kolkata",
});

console.log("⏳ Outstanding dues notification cron job scheduled.");
