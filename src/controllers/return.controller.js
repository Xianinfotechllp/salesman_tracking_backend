const returnService = require("../services/return.services");
const notificationService = require("../services/notification.services");
const Return = require("../models/return");

const handleCreateReturnRequest = async (req, res) => {
  try {
    const { client, product, quantity, reason } = req.body;
    const salesman = req.user.id;

    const newReturn = await returnService.createReturnRequest({
      salesman,
      client,
      product,
      quantity,
      reason,
    });

    await notificationService.createNotification({
      recipient: salesman,
      recipientType: "user-stas",
      message: `A new return request has been created for product: ${product}. Quantity: ${quantity}.`,
    });

    await notificationService.createNotification({
      recipient: null,
      recipientType: "testadmin",
      message: `New Return Request by Salesman ${salesman} for Product ID: ${product._id}`,
    });

    return res.status(201).json({
      message: "Return request created successfully",
      returnRequest: newReturn,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetAllReturns = async (req, res) => {
  try {
    const returns = await returnService.getAllReturns();
    return res.status(200).json({ returns });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetReturnById = async (req, res) => {
  const { id } = req.params;

  try {
    const returnRequest = await returnService.getReturnById(id);
    if (!returnRequest) {
      return res.status(404).json({ message: "Return request not found" });
    }
    return res.status(200).json({ returnRequest });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleApproveReturn = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedReturn = await returnService.updateReturnStatus(
      id,
      "approved"
    );

    if (!updatedReturn) {
      return res.status(404).json({ message: "Return request not found" });
    }

    const populatedReturn = await Return.findById(updatedReturn._id).populate(
      "salesman"
    );

    console.log("populated data:", populatedReturn);

    await notificationService.createNotification({
      recipient: populatedReturn.salesman._id,
      recipientType: "user-stas",
      message: `Your return request for product: ${populatedReturn.product} has been approved.`,
    });

    return res.status(200).json({
      message: "Return request approved successfully",
      returnRequest: populatedReturn,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleRejectReturn = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedReturn = await returnService.updateReturnStatus(
      id,
      "rejected"
    );

    if (!updatedReturn) {
      return res.status(404).json({ message: "Return request not found" });
    }

    // Populate salesman
    const populatedReturn = await Return.findById(updatedReturn._id).populate(
      "salesman"
    );

    await notificationService.createNotification({
      recipient: populatedReturn.salesman._id, // Use _id from populated salesman
      recipientType: "user-stas",
      message: `Your return request for product: ${populatedReturn.product} has been rejected.`,
    });

    return res.status(200).json({
      message: "Return request rejected successfully",
      returnRequest: populatedReturn,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleDeleteReturn = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReturn = await returnService.deleteReturnRequest(id);
    if (!deletedReturn) {
      return res.status(404).json({ message: "Return request not found" });
    }
    return res.status(200).json({ message: "Return request cancelled" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetReturnHistoryBySalesman = async (req, res) => {
  try {
    const salesmanId = req.params.id;

    const records = await returnService.getReturnHistoryBySalesman(salesmanId);
    return res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
};

module.exports = {
  handleCreateReturnRequest,
  handleGetAllReturns,
  handleGetReturnById,
  handleApproveReturn,
  handleRejectReturn,
  handleDeleteReturn,
  handleGetReturnHistoryBySalesman,
};
