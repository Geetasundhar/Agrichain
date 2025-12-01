import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
  buyer_name: { type: String, required: true },
  business_name: { type: String, required: true },
  district: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_image: { type: String },
}, { timestamps: true });

export default mongoose.model("Buyer", buyerSchema);
