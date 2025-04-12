const notificationService = require("../services/notification.services");

async function handleSendNotification(req, res) {
  const { recipient, recipientType, message, isRead } = req.body;
  try {
    const newNotification = await notificationService.createNotification({
      recipient,
      recipientType,
      message,
      isRead,
    });
    return res.status(201).json({
      message: "Notification sent successfully",
      notification: newNotification,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
}

async function handleGetNotifications(req, res) {
  const { userId } = req.params;
  const { recipientType } = req.query;

  try {
    const notifications = await notificationService.getNotificationsByUser(
      userId,
      recipientType
    );
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
}

async function handleGetAdminNotifications(req, res) {
  try {
    const notifications = await notificationService.getNotificationsByAdmin();
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
}

async function handleMarkAsRead(req, res) {
  const { id } = req.params;
  try {
    const updatedNotification =
      await notificationService.markNotificationAsRead(id);
    return res.status(200).json({
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
}

async function handleDeleteNotification(req, res) {
  const { id } = req.params;
  try {
    await notificationService.deleteNotification(id);
    return res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
}

module.exports = {
  handleSendNotification,
  handleGetNotifications,
  handleGetAdminNotifications,
  handleMarkAsRead,
  handleDeleteNotification,
};
