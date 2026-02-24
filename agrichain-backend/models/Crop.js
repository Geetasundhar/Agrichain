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
    category: { type: String, enum: ["Vegetable", "Fruit", "Grain"]},
    pricePerKg: { type: Number, required: true },
    quantityKg: { type: Number, required: true },
    durationNumber: { type: Number, required: true },
    durationPeriod: { type: String, enum: ["week", "month", "year"], required: true },
    fertilizer: { type: String, required: true },
    soilType: { type: String, required: true },
    images: [String], // base64 or URL (initial image at index 0)
    progressPhotos: [
      {
        imageData: String,
        capturedAt: { type: Date, default: Date.now },
        periodIndex: Number, // 0, 1, 2, or 3
      }
    ],
    qrCode: { type: String },
  },
  { timestamps: true } // ⭐ createdAt used for freshness logic
);

export default mongoose.model("Crop", cropSchema);