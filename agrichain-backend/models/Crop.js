import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cropName: { type: String, required: true },
  cropType: { type: String, required: true },
  quantityKg: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  location: { type: String, required: true },
  // ✅ Store Base64 image(s) directly in DB
  images: [{ type: String }], 
  // ✅ QR code as Base64
  qrCode: { type: String },   
  blockchainTx: { type: String }, // placeholder for blockchain tx hash
}, { timestamps: true });

export default mongoose.model("Crop", cropSchema);
