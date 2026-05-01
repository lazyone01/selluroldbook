const Cart = require("../models/Cart");
const Book = require("../models/Book");
const User = require("../models/User");
const Order = require("../models/Order");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  await cart.populate("items.book");
  return res.status(200).json({ cart });
};

const addToCart = async (req, res) => {
  const { bookId, quantity = 1 } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: "bookId is required." });
  }

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  const cart = await getOrCreateCart(req.user.id);
  const existingItem = cart.items.find((item) => item.book.toString() === bookId);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      book: book._id,
      seller: book.seller,
      quantity: Number(quantity),
      priceAtAddition: book.price,
    });
  }

  await cart.save();
  await cart.populate("items.book");

  return res.status(200).json({ message: "Book added to cart.", cart });
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || Number(quantity) < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1." });
  }

  const cart = await getOrCreateCart(req.user.id);
  const item = cart.items.find((it) => it.book.toString() === req.params.bookId);

  if (!item) {
    return res.status(404).json({ message: "Cart item not found." });
  }

  item.quantity = Number(quantity);
  await cart.save();
  await cart.populate("items.book");

  return res.status(200).json({ message: "Cart item updated.", cart });
};

const removeCartItem = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  cart.items = cart.items.filter((item) => item.book.toString() !== req.params.bookId);
  await cart.save();
  await cart.populate("items.book");

  return res.status(200).json({ message: "Cart item removed.", cart });
};

const checkout = async (req, res) => {
  const { deliveryAddress } = req.body;

  if (!deliveryAddress) {
    return res.status(400).json({ message: "Delivery address is required." });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const cart = await getOrCreateCart(req.user.id);
  await cart.populate("items.book");

  if (!cart.items.length) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  const orderItems = cart.items.map((item) => {
    const lineTotal = item.priceAtAddition * item.quantity;
    return {
      book: item.book._id,
      seller: item.seller,
      bookName: item.book.bookName,
      publication: item.book.publication,
      condition: item.book.condition,
      quantity: item.quantity,
      unitPrice: item.priceAtAddition,
      lineTotal,
      sellerAddress: item.book.sellerAddress,
      sellerEmail: item.book.sellerEmail,
    };
  });

  const totalPrice = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const order = await Order.create({
    user: user._id,
    userName: user.name,
    userEmail: user.email,
    deliveryAddress,
    items: orderItems,
    totalPrice,
  });

  cart.items = [];
  await cart.save();

  return res.status(201).json({ message: "Order placed successfully.", order });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  checkout,
};
