const attendanceService = require("../services/attendance.services");

async function handleCheckIn(req, res) {
  try {
    const { location } = req.body;
    const file = req.file;
    const salesmanId = req.user.id;

    const newAttendance = await attendanceService.checkIn(salesmanId, location,file);
    return res
      .status(201)
      .json({ message: "Checked in successfully", attendance: newAttendance });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

async function handleCheckOut(req, res) {
  try {
    const { id } = req.params;
    const salesmanId = req.user.id;

    const attendance = await attendanceService.checkOut(id, salesmanId);
    return res
      .status(200)
      .json({ message: "Checked out successfully", attendance });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

async function handleGetAllAttendance(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied: Only admins can view this resource" });
    }

    const records = await attendanceService.getAllAttendance();
    return res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

async function handleGetAttendanceBySalesman(req, res) {
  try {
    const { salesmanId } = req.params;
    const records = await attendanceService.getAttendanceBySalesman(salesmanId);
    return res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

module.exports = {
  handleCheckIn,
  handleCheckOut,
  handleGetAllAttendance,
  handleGetAttendanceBySalesman,
};
