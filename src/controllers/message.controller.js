const Message = require("../models/messages");
const userModel = require("../models/users")
const notificationService = require("../services/notification.services")

async function HandleSaveMessage(req, res) {
  try {
    const { senderId, receiverId, message, senderType } = req.body;
    console.log("Received request HSM:", req.body);

    if (!senderId || !receiverId || !message || !senderType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      createdAt: new Date(),
    });
    await newMessage.save();

    if (senderType === "testadmin") {
      const user = await userModel.findById(receiverId);

      if (!user) {
        return res.status(404).json({ error: "User recipient not found" });
      }

      await notificationService.createNotification({
        recipient: receiverId,
        recipientType: "user-stas",
        message: `New message from Admin: ${
          message.length > 30 ? message.substring(0, 30) + "..." : message
        }`,
        createdAt: new Date(),
      });
    } else if (senderType === "user-stas") {
      
      const user = await userModel.findById(senderId);

      if (!user) {
        return res.status(404).json({ error: "User sender not found" });
      }

      
      await notificationService.createNotification({
        recipientType: "testadmin",
        message: `New message from ${user.name}: ${
          message.length > 30 ? message.substring(0, 30) + "..." : message
        }`,
        createdAt: new Date(),
      });
    } else {
      return res.status(400).json({ error: "Invalid sender type" });
    }

    return res.status(200).json({ msg: "Message sent successfully" });
  } catch (error) {
    console.error("Error in HandleSaveMessage:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function HandleGetMessages(req, res) {
  try {
    const { senderId, receiverId } = req.query;
    console.log("Received request HGM:", req.query);


    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { HandleSaveMessage, HandleGetMessages };
