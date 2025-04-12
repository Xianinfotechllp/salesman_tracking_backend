const Order = require("../models/order");
const meetingModel = require("../models/meeting");
const attendanceModel = require("../models/attendance");
const expenseModel = require("../models/expense");

async function handleGetPerformanceAnalytics(req, res) {
  try {
    const [
      totalSalesAmount,
      completedOrdersCount,
      totalAttendanceCount,
      totalExpenseAmount,
      totalSalesmen,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ status: "completed" }),
      attendanceModel.countDocuments(), // Total attendance records
      expenseModel.aggregate([
        { $match: { status: "completed" } }, // Ensure the status filter is correct
        { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
      ]),
      attendanceModel.distinct("salesman"), // Unique salesmen
    ]);

    // Extract values from aggregation results
    const salesAmount =
      totalSalesAmount.length > 0 ? totalSalesAmount[0].totalSales : 0;
    const expenseAmount =
      totalExpenseAmount.length > 0 ? totalExpenseAmount[0].totalExpenses : 0;

    // Fixing attendance percentage calculation
    const totalWorkingSalesmen = totalSalesmen.length; // Total unique salesmen
    const totalAttendanceRecords = totalAttendanceCount; // Total attendance records

    const attendancePercentage =
      totalWorkingSalesmen > 0
        ? (
            (totalAttendanceRecords / (totalWorkingSalesmen * 30)) *
            100
          ).toFixed(2) // Assuming 30 working days per salesman
        : 0;

    return res.status(200).json({
      totalSalesAmount: salesAmount,
      totalCompletedOrders: completedOrdersCount,
      attendancePercentage: `${Math.min(attendancePercentage, 100)}%`, // Capping at 100%
      totalExpenseAmount: expenseAmount,
    });
  } catch (error) {
    console.error("Error fetching performance analytics:", error);
    return res.status(500).json({
      message: "An error occurred while fetching performance analytics.",
    });
  }
}

async function handleGetSalesPerformanceAnalytics(req, res) {
  const { startDate, endDate } = req.query;

  try {
    const filter = { status: "completed" };

    if (startDate && endDate) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: startOfDay, $lt: endOfDay };
    }

    const salesCount = await Order.countDocuments(filter);

    return res.status(200).json({ salesPerformance: salesCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching sales performance analytics.",
    });
  }
}

async function handleGetAttendanceAnalytics(req, res) {
  const { startDate, endDate } = req.query;

  try {
    const filter = {};

    if (startDate && endDate) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: startOfDay, $lt: endOfDay };
    }

    const attendanceCount = await attendanceModel.countDocuments(filter);

    return res.status(200).json({ attendanceTrends: attendanceCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching attendance analytics.",
    });
  }
}

module.exports = {
  handleGetPerformanceAnalytics,
  handleGetSalesPerformanceAnalytics,
  handleGetAttendanceAnalytics,
};
