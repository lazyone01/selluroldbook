const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Bookseller", required: true },
    bookName: { type: String, required: true, trim: true },
    publication: { type: String, required: true, trim: true },
    condition: {
      type: String,
      enum: ["Torn", "Highlighted heavily", "Good condition"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    sellerAddress: { type: String, required: true, trim: true },
    sellerEmail: { type: String, required: true, trim: true, lowercase: true },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

bookSchema.index({ bookName: "text", publication: "text" });

module.exports = mongoose.model("Book", bookSchema);
