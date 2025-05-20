const ApiError = require("../utils/ApiError");
const { validateAttendanceSchema } = require("../utils/validator");
const userModel = require("../models/users");
const {
  create,
  getAll,
  getByField,
  getById,
  remove,
  update,
} = require("../repository/genericRepository");
const mongoose = require("mongoose");
const attendanceModel = require("../models/attendance");
const fs = require("fs");
const cloudinary = require("../configs/cloudinary");

async function checkIn(salesman, location, file) {
  if (!mongoose.Types.ObjectId.isValid(salesman)) {
    throw new ApiError(400, "Invalid salesman ID format");
  }

  const { error, value } = validateAttendanceSchema({ salesman, location });
  if (error) {
    throw new ApiError(400, error.message);
  }

  const existingSalesman = await userModel.findById(salesman);
  if (!existingSalesman) {
    throw new ApiError(404, "Salesman not found");
  }
  try {
    // if (file) {
      
    //   const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    //   if (!allowedMimeTypes.includes(file.mimetype)) {
    //     throw new ApiError(
    //       400,
    //       "Invalid file type. Only JPEG, PNG, and WEBP images are allowed."
    //     );
    //   }

    // instead of this we will use all file types now | shan

    if (file) {
    if (!file.mimetype.startsWith("image/")) {
    throw new ApiError(400, "Invalid file type. Only image files are allowed.");
  }


      
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: "salesman-images",
        resource_type: "image",
      });

      image = result.secure_url;
      await fs.promises.unlink(file.path);
    }

    const newAttendance = new attendanceModel({
      salesman,
      checkInTime: new Date(),
      location,
      image,
    });

    return await newAttendance.save();
  } catch (error) {
    console.error("Check-in Error:", error);

    if (file?.path && fs.existsSync(file.path)) {
      await fs.promises.unlink(file.path);
    }

    throw new ApiError(500, "Error creating attendance");
  }
}

async function checkOut(id) {
  const attendance = await getById(attendanceModel, id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid salesman ID format");
  }

  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }

  attendance.checkOutTime = new Date();
  return await attendance.save();
}

async function getAllAttendance() {
  try {
    const attendances = await attendanceModel
      .find()
      .populate("salesman", "name");

    return attendances;
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
}

async function getAttendanceBySalesman(salesmanId) {
  if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
    throw new ApiError(400, "Invalid salesman ID format");
  }

  const existingSalesman = await userModel.findById(salesmanId);
  if (!existingSalesman) {
    throw new ApiError(404, "Salesman not found");
  }

  const records = await getByField(attendanceModel, "salesman", salesmanId, {
    path: "salesman",
    select: "name",
  });

  if (!records.length) {
    throw new ApiError(404, "No attendance records found for this salesman");
  }
  return records;
}

module.exports = {
  checkIn,
  checkOut,
  getAllAttendance,
  getAttendanceBySalesman,
};
