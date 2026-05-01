const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  createBook,
  getAllBooks,
  getSellerBooks,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/", authMiddleware, getAllBooks);
router.get("/seller/mine", authMiddleware, roleMiddleware("bookseller"), getSellerBooks);
router.post("/", authMiddleware, roleMiddleware("bookseller"), upload.single("image"), createBook);
router.put("/:id", authMiddleware, roleMiddleware("bookseller"), upload.single("image"), updateBook);
router.delete("/:id", authMiddleware, roleMiddleware("bookseller"), deleteBook);

module.exports = router;
