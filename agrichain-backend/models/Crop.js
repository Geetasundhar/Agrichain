import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cropName: { type: String, required: true },
  cropType: { type: String, required: true },
  quantityKg: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  location: { type: String, required: true },
  images: [{ type: String }], // store file paths or cloud URLs
  qrCode: { type: String },   // path or base64 QR
  blockchainTx: { type: String }, // placeholder for blockchain tx hash
}, { timestamps: true });

export default mongoose.model("Crop", cropSchema);
