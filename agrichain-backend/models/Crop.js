import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropName: { type: String, required: true },
    cropType: { type: String },
    category: { type: String, enum: ["Vegetable", "Fruit", "Grain"] },
    pricePerKg: { type: Number, default: 0 },
    quantityKg: { type: Number, default: 0 },
    durationNumber: { type: Number, required: true },
    durationPeriod: { type: String, enum: ["week", "month", "year"], required: true },
    soilType: { type: String, required: true },
    // references to purchased products (required)
    seedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    fertilizerProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // track quantities used from purchases for this crop
    seedQuantityUsed: { type: Number, default: 0 },
    fertilizerQuantityUsed: { type: Number, default: 0 },
    images: [String], // base64 or URL (initial image at index 0)
    progressPhotos: [
      {
        imageData: String,
        capturedAt: { type: Date, default: Date.now },
        periodIndex: Number, // 0, 1, 2, or 3
      }
    ],
    qrCode: { type: String },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true } // ⭐ createdAt used for freshness logic
);

export default mongoose.model("Crop", cropSchema);