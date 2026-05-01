const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getUserOrders, getSellerOrders } = require("../controllers/orderController");

const router = express.Router();

router.get("/my", authMiddleware, roleMiddleware("user"), getUserOrders);
router.get("/seller", authMiddleware, roleMiddleware("bookseller"), getSellerOrders);

module.exports = router;
