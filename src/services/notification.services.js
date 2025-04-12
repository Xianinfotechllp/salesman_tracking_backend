const { validateNotificationSchema } = require("../utils/validator");
const GenericRepo = require("../repository/genericRepository");
const Notification = require("../models/notifications");
const userModel = require("../models/users");
const adminModel = require("../models/admin"); // Assuming adminModel is imported
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

const createNotification = async (notificationData) => {
  try {
    const { error, value } = validateNotificationSchema(notificationData);
    const { recipient, recipientType } = value;

    // Validate recipient only if it's NOT "testadmin"
    if (
      recipientType !== "testadmin" &&
      !mongoose.Types.ObjectId.isValid(recipient)
    ) {
      throw new ApiError(400, "Invalid recipient ID format");
    }

    if (recipientType === "user-stas") {
      const recipientExists = await userModel.findById(recipient);
      if (!recipientExists) throw new ApiError(404, "User not found");
    } else if (recipientType !== "testadmin") {
      throw new ApiError(400, "Invalid recipientType");
    }

    return await GenericRepo.create(Notification, value);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// const getNotificationsByUser = async (userId, recipientType) => {
//   try {
//     if (!userId) {
//       throw new ApiError(400, "User ID is required");
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       throw new ApiError(400, "Invalid recipient ID format");
//     }

//     let existingRecipient;

//     if (recipientType === "user-stas") {
//       existingRecipient = await userModel.findById(userId);
//       if (!existingRecipient) {
//         throw new ApiError(404, "User not found");
//       }
//     } else if (recipientType === "testadmin") {
//       existingRecipient = await adminModel.findById(userId);
//       if (!existingRecipient) {
//         throw new ApiError(404, "Admin not found");
//       }
//     } else {
//       throw new ApiError(400, "Invalid recipientType");
//     }

//     return await GenericRepo.getByField(Notification, "recipient", userId);
//   } catch (error) {
//     throw error;
//   }
// };

const getNotificationsByUser = async (userId) => {
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID format");
    }

    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    return await GenericRepo.getByField(Notification, "recipient", userId);
  } catch (error) {
    throw error;
  }
};

//noId, notifications are general for admins
const getNotificationsByAdmin = async () => {
  try {
    return await Notification.find({ recipientType: "testadmin" }).sort({ createdAt: -1 });;
  } catch (error) {
    throw error;
  }
};

const markNotificationAsRead = async (id) => {
  try {
    if (!id) {
      throw new ApiError(400, "Notification ID is required");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid notification ID format");
    }

    return await GenericRepo.update(Notification, id, { isRead: true });
  } catch (error) {
    throw error;
  }
};

const deleteNotification = async (id) => {
  try {
    if (!id) {
      throw new ApiError(400, "Notification ID is required");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid notification ID format");
    }

    return await GenericRepo.remove(Notification, id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  getNotificationsByAdmin,
  markNotificationAsRead,
  deleteNotification,
};
