const User = require("../models/User");
const Bookseller = require("../models/Bookseller");
const Book = require("../models/Book");
const Order = require("../models/Order");

const getOverview = async (req, res) => {
  const [users, booksellers, books, bookings] = await Promise.all([
    User.find().select("name email address createdAt"),
    Bookseller.find().select("name email address createdAt"),
    Book.find().populate("seller", "name email address"),
    Order.find()
      .populate("user", "name email address")
      .populate("items.seller", "name email address")
      .populate("items.book", "bookName publication condition price"),
  ]);

  return res.status(200).json({
    users,
    booksellers,
    books,
    bookings,
  });
};

const getUsers = async (req, res) => {
  const users = await User.find().select("name email address createdAt").sort({ createdAt: -1 });
  return res.status(200).json({ users });
};

const getBooksellers = async (req, res) => {
  const booksellers = await Bookseller.find().select("name email address createdAt").sort({ createdAt: -1 });
  return res.status(200).json({ booksellers });
};

const getBooks = async (req, res) => {
  const books = await Book.find().populate("seller", "name email address").sort({ createdAt: -1 });
  return res.status(200).json({ books });
};

const getBookings = async (req, res) => {
  const bookings = await Order.find()
    .populate("user", "name email address")
    .populate("items.seller", "name email address")
    .populate("items.book", "bookName publication condition")
    .sort({ createdAt: -1 });

  return res.status(200).json({ bookings });
};

module.exports = {
  getOverview,
  getUsers,
  getBooksellers,
  getBooks,
  getBookings,
};
