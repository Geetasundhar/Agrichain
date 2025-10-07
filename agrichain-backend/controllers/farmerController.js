import Crop from "../models/Crop.js";
import QRCode from "qrcode";
// Add new crop
export const addCrop = async (req, res) => {
  try {
    const { cropName, cropType, quantityKg, pricePerKg, location, images } = req.body;
    if (!cropName || !cropType || !quantityKg || !pricePerKg || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Farmer ID from JWT
    const farmerId = req.user.id;
    // Create new crop document
    const newCrop = new Crop({
      farmerId,
      cropName,
      cropType,
      quantityKg,
      pricePerKg,
      location,
      images: images || [],
    });

    // Generate QR code (using MongoDB ID)
    const qrCode = await QRCode.toDataURL(newCrop._id.toString());
    newCrop.qrCode = qrCode;
    // Placeholder for blockchain transaction
    newCrop.blockchainTx = "BLOCKCHAIN_TX_HASH_PLACEHOLDER";
    // Save crop
    await newCrop.save();
    res.status(201).json({
      message: "Crop added successfully",
      crop: newCrop,
    });
  } catch (error) {
    console.error("Add Crop Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// Get all crops
export const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching crops", error: error.message });
  }
};
export const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.status(200).json(crop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching crop", error: error.message });
  }
};