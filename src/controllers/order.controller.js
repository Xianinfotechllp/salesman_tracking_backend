const orderService = require("../services/order.services");
const notificationService = require("../services/notification.services");
const Order = require("../models/order")

const handleCreateOrder = async (req, res) => {
  const orderData = req.body;
  try {
    const newOrder = await orderService.createOrder(orderData);
    console.log("Order data:", newOrder);

    
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("salesmanId", "name") 
      .populate("clientId", "name") 
      .populate("products.productId", "name"); 

    const salesmanName = populatedOrder.salesmanId?.name || "Unknown Salesman";
    const clientName = populatedOrder.clientId?.name || "Unknown Client";
    const productCount = populatedOrder.products.length;
    const totalAmount = populatedOrder.totalAmount;

    const messageForSalesman = `New order from ${clientName} (₹${totalAmount}) with ${productCount} product(s).`;
    const messageForAdmin = `Salesman ${salesmanName} placed an order for ${clientName} (₹${totalAmount}).`;

    await notificationService.createNotification({
      recipient: newOrder.salesmanId,
      recipientType: "user-stas",
      message: messageForSalesman,
    });

    await notificationService.createNotification({
      recipient: null,
      recipientType: "testadmin",
      message: messageForAdmin,
    });

    return res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};



const handleGetAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetOrdersBySalesman = async (req, res) => {
  const salesmanId = req.params.salesmanId;
  try {
    const orders = await orderService.getOrdersBySalesman(salesmanId);
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await orderService.getOrderById(id);
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleUpdateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await orderService.updateOrderStatus(id, status);
    return res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleDeleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await orderService.deleteOrder(id);
    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

async function HandleEditOrder(req, res) {
  try {
    const { orderId } = req.params;


    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const { clientId, status, products, totalAmount } = req.body;

    if (!status || !totalAmount || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Missing required fields: status, products, or totalAmount." });
    }

    for (let product of products) {
      if (!product.productId || !product.quantity) {
        return res.status(400).json({ message: "Each product must have a productId and quantity." });
      }
    }

    // Update the order, ignoring clientId
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, products, totalAmount }, // Exclude clientId
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ message: "Order updated successfully.", updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Could not update the order." });
  }
}



module.exports = {
  HandleEditOrder,
};


module.exports = {
  handleCreateOrder,
  handleGetAllOrders,
  handleGetOrdersBySalesman,
  handleGetOrderById,
  handleUpdateOrderStatus,
  HandleEditOrder,
  handleDeleteOrder,
};
