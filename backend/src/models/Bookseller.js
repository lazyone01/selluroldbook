const mongoose = require("mongoose");

const booksellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    address: { type: String, required: true, trim: true },
    role: { type: String, default: "bookseller", immutable: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookseller", booksellerSchema);
