const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getOverview,
  getUsers,
  getBooksellers,
  getBooks,
  getBookings,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));
router.get("/overview", getOverview);
router.get("/users", getUsers);
router.get("/booksellers", getBooksellers);
router.get("/books", getBooks);
router.get("/bookings", getBookings);

module.exports = router;
