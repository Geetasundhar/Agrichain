import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    cropName: String,
    quantityBought: Number,
    pricePerKg: Number,
    totalAmount: Number,
    status: {
      type: String,
      default: "SUCCESS",
    },
    paymentStatus: {
      type: String,
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
