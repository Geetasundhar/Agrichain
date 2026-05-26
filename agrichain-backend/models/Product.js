const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, unique: true },
    productType: {
      type: String,
      enum: ["seed", "fertilizer"],
      required: true,
    },
    productName: { type: String, required: true },
    image: { type: String }, // could be URL or base64 string
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Retailer",
      required: true,
    },
  },
  { timestamps: true }
);

// automatically generate a human readable id when saving
productSchema.pre("save", function (next) {
  if (!this.productId) {
    this.productId = `PRD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
