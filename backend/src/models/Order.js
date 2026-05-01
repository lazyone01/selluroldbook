const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Bookseller", required: true },
    bookName: { type: String, required: true },
    publication: { type: String, required: true },
    condition: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    sellerAddress: { type: String, required: true },
    sellerEmail: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Placed", "Confirmed", "Shipped", "Delivered"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
