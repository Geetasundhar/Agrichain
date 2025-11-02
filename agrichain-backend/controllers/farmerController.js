import Crop from "../models/Crop.js";

// Add new crop
export const addCrop = async (req, res) => {
  try {
    const { farmerId, name, type, quantity, price, location, image } = req.body;

    if (!farmerId || !name || !type || !quantity || !price || !location || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Generate a simple QR code string (can later integrate QR code lib)
    const qrCodeText = `Crop-${Date.now()}`;

    const newCrop = await Crop.create({
      farmerId,
      cropName: name,
      cropType: type,
      quantityKg: quantity,
      pricePerKg: price,
      location,
      images: [image], // store Base64
      qrCode: qrCodeText,
    });

    res.status(201).json({ crop: newCrop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all crops
export const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate("farmerId", "name email");
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get crop by ID
export const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate("farmerId", "name email");
    if (!crop) return res.status(404).json({ error: "Crop not found" });
    res.json(crop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
