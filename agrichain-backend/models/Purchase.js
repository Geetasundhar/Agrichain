const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // store the Product.productId string for quick reference
    productId: { type: String },
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Retailer",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // farmers are stored in User model
      required: true,
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
