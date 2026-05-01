const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  checkout,
} = require("../controllers/cartController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("user"));

router.get("/", getCart);
router.post("/add", addToCart);
router.patch("/item/:bookId", updateCartItem);
router.delete("/item/:bookId", removeCartItem);
router.post("/checkout", checkout);

module.exports = router;
