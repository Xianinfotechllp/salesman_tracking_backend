const express = require("express");
const router = express.Router();
const {
  handleSendNotification,
  handleGetNotifications,
  handleMarkAsRead,
  handleDeleteNotification,
  handleGetAdminNotifications,
} = require("../controllers/notification.controller");

router.post("/", handleSendNotification);
//user notification
router.get("/user/:userId", handleGetNotifications);
//admin notificaiton
router.get("/admin", handleGetAdminNotifications);

router.put("/read/:id", handleMarkAsRead);
router.delete("/:id", handleDeleteNotification);

module.exports = router;
