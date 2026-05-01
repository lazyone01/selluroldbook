const Book = require("../models/Book");
const Bookseller = require("../models/Bookseller");

const createBook = async (req, res) => {
  const { bookName, publication, condition, price, sellerAddress, sellerEmail } = req.body;

  if (!bookName || !publication || !condition || !price || !sellerAddress || !sellerEmail) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const seller = await Bookseller.findById(req.user.id);
  if (!seller) {
    return res.status(404).json({ message: "Bookseller not found." });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

  const book = await Book.create({
    seller: seller._id,
    bookName,
    publication,
    condition,
    price,
    sellerAddress,
    sellerEmail,
    imageUrl,
  });

  return res.status(201).json({ message: "Book added successfully.", book });
};

const getAllBooks = async (req, res) => {
  const { page = 1, limit = 12, search = "", publication = "", minPrice, maxPrice } = req.query;

  const query = {};

  if (search) {
    query.bookName = { $regex: search, $options: "i" };
  }

  if (publication) {
    query.publication = { $regex: publication, $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const currentPage = Number(page);
  const perPage = Number(limit);

  const [books, total] = await Promise.all([
    Book.find(query)
      .populate("seller", "name email address")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage),
    Book.countDocuments(query),
  ]);

  return res.status(200).json({
    books,
    pagination: {
      total,
      page: currentPage,
      pages: Math.ceil(total / perPage),
    },
  });
};

const getSellerBooks = async (req, res) => {
  const books = await Book.find({ seller: req.user.id }).sort({ createdAt: -1 });
  return res.status(200).json({ books });
};

const updateBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (book.seller.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden: you can only edit your own books." });
  }

  const allowedFields = ["bookName", "publication", "condition", "price", "sellerAddress", "sellerEmail"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      book[field] = req.body[field];
    }
  });

  if (req.file) {
    book.imageUrl = `/uploads/${req.file.filename}`;
  }

  await book.save();

  return res.status(200).json({ message: "Book updated successfully.", book });
};

const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (book.seller.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden: you can only delete your own books." });
  }

  await book.deleteOne();

  return res.status(200).json({ message: "Book deleted successfully." });
};

module.exports = {
  createBook,
  getAllBooks,
  getSellerBooks,
  updateBook,
  deleteBook,
};
