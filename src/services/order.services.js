const { validateOrderSchema } = require("../utils/validator");
const { MONEY_TO_POINT } = require("../configs/pointConversion");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const GenericRepo = require("../repository/genericRepository");
const Order = require("../models/order");
const Salesman = require("../models/users");
const Client = require("../models/client");
const Product = require("../models/product");

const createOrder = async (orderData) => {
  try {
    const { error, value } = validateOrderSchema(orderData);
    if (error) throw new ApiError(400, error.details[0].message);

    const { salesmanId, clientName, products, totalAmount, status } = value;

    if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    const client = await Client.findOne({ name: clientName });
    if (!client) throw new ApiError(404, `Client '${clientName}' not found`);
    
    const clientId = client._id;

    let calculatedTotal = 0;
    const validProducts = await Promise.all(
      products.map(async (item) => {
        if (item.quantity < 1) {
          throw new ApiError(400, `Quantity for product ${item.productId} must be at least 1`);
        }

        const product = await Product.findById(item.productId);
        if (!product) {
          throw new ApiError(404, `Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new ApiError(400, `Not enough stock for product ${item.productId}`);
        }

        calculatedTotal += product.price * item.quantity;

        product.stock -= item.quantity;
        await product.save();

        return { productId: item.productId, quantity: item.quantity };
      })
    );

    if (calculatedTotal !== totalAmount) {
      throw new ApiError(400, "Total amount does not match product prices");
    }

    const newOrder = await Order.create({
      salesmanId,
      clientId,
      products: validProducts,
      totalAmount,
      status: status || "pending",
    });

    return newOrder;
  } catch (error) {
    throw error;
  }
};


const getAllOrders = async () => {
  try {
    const orders = await Order.find({})
      .populate("clientId", "name")
      .select("_id clientId products totalAmount status createdAt") 
      .exec();

    
    return orders.map((order) => ({
      orderId: order._id,
      clientName: order.clientId.name,
      orderDate: order.createdAt, 
      totalAmount: order.totalAmount,
      status: order.status,
    }));
  } catch (error) {
    throw error;
  }
};

const getOrdersBySalesman = async (salesmanId) => {
  console.log("salesmanId", salesmanId);
  try {
    if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    const existingSalesman = await Salesman.findById(salesmanId);
    if (!existingSalesman) {
      throw new ApiError(404, "Salesman not found");
    }
    const orders = await GenericRepo.getByField(
      Order,
      "salesmanId",
      salesmanId,
      "salesmanId clientId products.productId"
    );
    if (!orders.length)
      throw new ApiError(404, "No orders found for this salesman");

    return orders;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Order ID format");
    }
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      throw new ApiError(404, "Order not found");
    }
    const order = await GenericRepo.getById(
      Order,
      id,
      "salesmanId clientId products.productId"
    );
    if (!order) throw new ApiError(404, "Order not found");

    return order;
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Order ID format");
    }

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      throw new ApiError(404, "Order not found");
    }

    const validStatuses = ["pending", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    if (existingOrder.status === "completed" && status === "completed") {
      throw new ApiError(400, "Order is already completed");
    }

    if (existingOrder.status === "cancelled" && status === "cancelled") {
      throw new ApiError(400, "Order is already cancelled");
    }

    // Restore stock only if the order was not already cancelled
    if (status === "cancelled" && existingOrder.status !== "cancelled") {
      for (const item of existingOrder.products) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity; // Restore stock
          await product.save();
        }
      }
    }

    const updatedOrder = await GenericRepo.update(Order, id, { status });
    if (!updatedOrder) throw new ApiError(404, "Order not found");

    if (status === "completed") {
      await awardPoints(id);
    }

    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

const deleteOrder = async (id) => {
  try {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.status == "pending")
      throw new ApiError(400, "Pending Order cannot be Deleted");

    await Order.deleteOne({ _id: id });

    return { message: "Order Deleted successfully" };
  } catch (error) {
    throw error;
  }
};

const awardPoints = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.status !== "completed") {
      throw new ApiError(
        400,
        "Points can only be awarded for completed orders"
      );
    }

    const salesman = await Salesman.findById(order.salesmanId);
    if (!salesman) throw new ApiError(404, "Salesman not found");

    const pointsToAward = Math.floor(order.totalAmount * MONEY_TO_POINT);
    salesman.points = (salesman.points || 0) + pointsToAward;
    await salesman.save();

    return { message: `Awarded ${pointsToAward} points to Salesman` };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersBySalesman,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  awardPoints,
};
