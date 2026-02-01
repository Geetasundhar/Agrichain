import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    cropName: { type: String, required: true },
    category: { type: String, enum: ["Vegetable", "Fruit", "Grain"]},
    pricePerKg: { type: Number, required: true },
    quantityKg: { type: Number, required: true },
    location: { type: String },
    images: [String], // base64 or URL
  },
  { timestamps: true } // ⭐ createdAt used for freshness logic
);

export default mongoose.model("Crop", cropSchema);
