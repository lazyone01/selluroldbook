const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { requestOtp, signup, login, getMe } = require("../controllers/authController");

const router = express.Router();

router.post("/request-otp", requestOtp);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
