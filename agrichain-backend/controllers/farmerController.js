import Crop from "../models/Crop.js";
import Farmer from "../models/User.js";
import QRCode from "qrcode"; // npm install qrcode

// ➤ Add new crop
export const addCrop = async (req, res) => {
  try {
    // 🔐 farmerId comes from JWT, NOT body
    const farmerId = req.user.id;

    const { name, type, quantity, price, location, image } = req.body;

    if (!name || !type || !quantity || !price || !location || !image) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        status: "error",
        message: "Farmer not found",
      });
    }

    const newCrop = await Crop.create({
      farmerId,
      cropName: name,
      cropType: type,
      quantityKg: quantity,
      pricePerKg: price,
      location,
      images: [image],
    });

    const qrDetails = [
      `🌾 FARMER DETAILS`,
      `---------------------------`,
      `Name     : ${farmer.name}`,
      `Phone    : ${farmer.phone}`,
      `Email    : ${farmer.email}`,
      `Location : ${farmer.location || location}`,
      ``,
      `🌱 CROP DETAILS`,
      `---------------------------`,
      `Crop Name : ${name}`,
      `Crop Type : ${type}`,
      `Quantity  : ${quantity} kg`,
      `Price/kg  : ₹${price}`,
      `Added On  : ${new Date().toLocaleDateString()}`,
    ].join("\n");

    const qrCodeBase64 = await QRCode.toDataURL(qrDetails);

    newCrop.qrCode = qrCodeBase64;
    await newCrop.save();

    return res.status(201).json({
      status: "success",
      message: "✅ Crop added successfully with QR code!",
      crop: {
        id: newCrop._id,
        cropName: newCrop.cropName,
        cropType: newCrop.cropType,
        quantityKg: newCrop.quantityKg,
        pricePerKg: newCrop.pricePerKg,
        location: newCrop.location,
        qrCode: newCrop.qrCode,
      },
    });

  } catch (err) {
    console.error("Add Crop Error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};


// ➤ Get all crops
export const getAllCrops = async (req, res) => {
  try {
    // ✅ Fetch crops and populate farmer name & email
    const crops = await Crop.find().populate("farmerId", "name email");

    // ✅ Format data to match your frontend
    const formatted = crops.map(c => ({
      _id: c._id,
      name: c.cropName, // corrected
      type: c.cropType, // corrected
      quantity: c.quantityKg, // corrected
      price: c.pricePerKg, // corrected
      image: c.images && c.images.length > 0 ? c.images[0] : null, // show first image
      farmerName: c.farmerId?.name || "Unknown Farmer",
      quality: Math.floor(Math.random() * 5) + 1, // ⭐ random rating
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching crops:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ➤ Get crop by ID
export const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate("farmerId", "name email phone location");
    if (!crop) {
      return res.status(404).json({ status: "error", message: "Crop not found" });
    }
    res.status(200).json({ status: "success", crop });
  } catch (err) {
    console.error("Get Crop By ID Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// ➤ Get simplified crop storage data (for reports)
// ➤ Get storage report for the logged-in farmer only
export const getStorageReport = async (req, res) => {
  try {
    const farmerId = req.user.id; // 👈 from auth middleware
    const crops = await Crop.find({ farmerId }, "cropName quantityKg");

    if (!crops.length) {
      return res.status(200).json({ status: "empty", message: "No crops found" });
    }

    const storageData = crops.map(crop => ({
      crop: crop.cropName,
      quantity: crop.quantityKg
    }));

    res.status(200).json({ status: "success", data: storageData });
  } catch (err) {
    console.error("Get Storage Report Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
