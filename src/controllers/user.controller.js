const userModel = require("../models/users");
const Order = require("../models/order");
const collectionModel = require("../models/collection");
const meetingModel = require("../models/meeting");
const mongoose = require("mongoose");

async function handleGetAllUsers(req, res) {
  try {
    const users = await userModel.find();
    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function handleGetUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID Format" });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

//dashboard-metric-user
// async function handleGetUserMetrics(req, res) {
//     try {
//       if (!req.user || !req.user.id) {
//         return res.status(400).json({ message: "User ID not found in token" });
//       }
//       const userId = new mongoose.Types.ObjectId(req.user.id);

//       const [orderCount, meetingCount, totalCollectionsAmount] = await Promise.all([
//         Order.countDocuments({ salesmanId: userId }),
//         meetingModel.countDocuments({ salesman: userId }),
//         collectionModel.aggregate([
//           { $match: { salesman: userId } },
//           { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
//         ]),
//       ]);

//       return res.status(200).json({
//         ordersCount: orderCount,
//         meetingsCount: meetingCount,
//         collectionsTotalAmount:
//           totalCollectionsAmount.length > 0 ? totalCollectionsAmount[0].totalAmount : 0,
//       });
//     } catch (error) {
//       console.error("Error in handleGetUserMetrics:", error);
//       return res.status(500).json({ message: "An error occurred while fetching user metrics." });
//     }
//   }
async function handleGetUserMetrics(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "User ID not provided in params" });
    }

    const userId = new mongoose.Types.ObjectId(id);

    
    const user = await userModel.findById(userId).select('name email mobileNumber avatar');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [orderCount, meetingCount, totalCollectionsAmount] = await Promise.all([
      Order.countDocuments({ salesmanId: userId }),
      meetingModel.countDocuments({ salesman: userId }),
      collectionModel.aggregate([
        { $match: { salesman: userId } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        avatar: user.avatar,
      },
      ordersCount: orderCount,
      meetingsCount: meetingCount,
      collectionsTotalAmount:
        totalCollectionsAmount.length > 0
          ? totalCollectionsAmount[0].totalAmount
          : 0,
    });
  } catch (error) {
    console.error("Error in handleGetUserMetrics:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching user metrics." });
  }
}


async function handleEditUser(req, res) {
  try {
    const { id } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID Format" });
    }

    
    const { name, email, points } = req.body;

    
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (points !== undefined) updatedFields.points = points; 

    
    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid fields to update" });
    }

    
    const user = await userModel.findByIdAndUpdate(id, updatedFields, {
      new: true, 
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function handleDeleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID Format" });
    }

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleGetUserMetrics,
  handleEditUser,
  handleDeleteUser,
};
