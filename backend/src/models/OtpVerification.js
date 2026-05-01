const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    role: { type: String, required: true, enum: ["user", "bookseller", "admin"] },
    purpose: { type: String, required: true, enum: ["signup", "login"] },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);
