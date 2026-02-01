import Crop from "../models/Crop.js";
import Farmer from "../models/User.js"; 
import Order from "../models/Order.js"

/**
 * 🛒 Get all crops for buyer
 * Logic:
 * - Calculate crop age (days since added)
 * - Vegetables & fruits get higher priority
 * - Older crops appear FIRST (rotting soon)
 */
export const getAllCropsForBuyer = async (req, res) => {
  try {
    // 🔹 Fetch crops with farmer basic details
    const crops = await Crop.find()
      .populate("farmerId", "name phone location")
      .sort({ createdAt: -1 });

    const today = new Date();

    // 🔹 Process crops
    const processedCrops = crops.map((crop) => {
      const ageInDays = Math.floor(
        (today - new Date(crop.createdAt)) / (1000 * 60 * 60 * 24)
      );

      // 🔥 Priority logic
      let priorityScore = ageInDays;
      if (
        crop.cropType.toLowerCase() === "vegetable" ||
        crop.cropType.toLowerCase() === "fruit"
      ) {
        priorityScore = ageInDays * 2;
      }

      return {
        _id: crop._id,
        cropName: crop.cropName,
        cropType: crop.cropType,
        quantityKg: crop.quantityKg,
        pricePerKg: crop.pricePerKg,
        location: crop.location,
        images: crop.images,
        createdAt: crop.createdAt,
        ageInDays,
        priorityScore,
        farmer: crop.farmerId,
      };
    });

    // 🔹 Sort: highest priority FIRST
    processedCrops.sort((a, b) => b.priorityScore - a.priorityScore);

    res.status(200).json({
      status: "success",
      total: processedCrops.length,
      crops: processedCrops,
    });

  } catch (error) {
    console.error("❌ Buyer Get Crops Error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch crops",
      error: error.message,
    });
  }
};

export const buyCrop = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { cropId, buyQuantity } = req.body;

    if (!cropId || !buyQuantity || buyQuantity <= 0) {
      return res.status(400).json({ status: "error", message: "Invalid quantity" });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ status: "error", message: "Crop not found" });
    }

    if (buyQuantity > crop.quantityKg) {
      return res.status(400).json({
        status: "error",
        message: `Only ${crop.quantityKg} kg available`,
      });
    }

    crop.quantityKg -= buyQuantity;
    await crop.save();

    const order = await Order.create({
      buyerId,
      farmerId: crop.farmerId,
      cropId: crop._id,
      cropName: crop.cropName,
      quantityBought: buyQuantity,
      pricePerKg: crop.pricePerKg,
      totalAmount: buyQuantity * crop.pricePerKg,
    });

    res.status(200).json({
      status: "success",
      message: "Purchase successful. Thank you for shopping 🌱",
      order,
      remainingQuantity: crop.quantityKg,
    });
  } catch (err) {
    console.error("Buy Crop Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};