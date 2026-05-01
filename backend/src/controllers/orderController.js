const Order = require("../models/Order");

const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.book", "bookName publication condition")
    .populate("items.seller", "name email address")
    .sort({ createdAt: -1 });

  return res.status(200).json({ orders });
};

const getSellerOrders = async (req, res) => {
  const orders = await Order.find({ "items.seller": req.user.id })
    .populate("user", "name email address")
    .populate("items.book", "bookName publication condition")
    .populate("items.seller", "name email address")
    .sort({ createdAt: -1 });

  const filteredOrders = orders
    .map((order) => ({
      ...order.toObject(),
      items: order.items.filter((item) => item.seller?._id?.toString() === req.user.id),
    }))
    .filter((order) => order.items.length > 0);

  return res.status(200).json({ orders: filteredOrders });
};

module.exports = {
  getUserOrders,
  getSellerOrders,
};
