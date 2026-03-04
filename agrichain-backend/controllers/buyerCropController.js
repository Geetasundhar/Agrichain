import Crop from "../models/Crop.js";
import Farmer from "../models/User.js";
import BuyerPurchase from "../models/BuyerPurchase.js";

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
      .populate("farmerId", "name phone")
      .sort({ createdAt: -1 });

    const today = new Date();

    // 🔹 Process crops - Filter out crops with null farmer, incomplete, and out of stock crops
    const processedCrops = crops
      .filter((crop) => crop.farmerId !== null && crop.isCompleted === true && crop.quantityKg > 0)
      .map((crop) => {
        const ageInDays = Math.floor(
          (today - new Date(crop.createdAt)) / (1000 * 60 * 60 * 24)
        );

        // 🔥 Priority logic
        let priorityScore = ageInDays;
        if (
          crop.cropType &&
          (crop.cropType.toLowerCase() === "vegetable" ||
            crop.cropType.toLowerCase() === "fruit")
        ) {
          priorityScore = ageInDays * 2;
        }

        return {
          _id: crop._id,
          cropName: crop.cropName,
          cropType: crop.cropType,
          quantityKg: crop.quantityKg,
          pricePerKg: crop.pricePerKg,
          location: crop.farmerId?.name || "Unknown Farmer",
          images: crop.images || [],
          createdAt: crop.createdAt,
          ageInDays,
          priorityScore,
          farmer: crop.farmerId,
          isCompleted: crop.isCompleted,
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

    const totalPrice = buyQuantity * crop.pricePerKg;

    const purchase = await BuyerPurchase.create({
      buyer: buyerId,
      farmer: crop.farmerId,
      crop: crop._id,
      quantityKg: buyQuantity,
      totalPrice: totalPrice,
    });

    res.status(200).json({
      status: "success",
      message: "Purchase successful. Thank you for shopping 🌱",
      purchase,
      remainingQuantity: crop.quantityKg,
    });
  } catch (err) {
    console.error("Buy Crop Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

/**
 * 🔍 Get detailed data for a specific crop (Buyer view)
 * Includes Farmer details, Seed Product info (and its Retailer), Fertilizer info (and its Retailer).
 */
export const getSingleCropForBuyer = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch crop with populated fields
    const crop = await Crop.findById(id)
      .populate("farmerId", "name email phone photo location") // Farmer info
      .populate({
        path: "seedProduct",
        select: "productName productType image price",
        populate: {
          path: "retailer",
          select: "name verified_licenses shop_image" // Seed Retailer info
        }
      })
      .populate({
        path: "fertilizerProduct",
        select: "productName productType image price",
        populate: {
          path: "retailer",
          select: "name verified_licenses shop_image" // Fertilizer Retailer info
        }
      });

    if (!crop) {
      return res.status(404).json({
        status: "error",
        message: "Crop not found"
      });
    }

    res.status(200).json({
      status: "success",
      crop,
    });

  } catch (err) {
    console.error("Get Single Crop Error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};

/**
 * 🛒 Get all purchases for buyer history
 */
export const getBuyerPurchases = async (req, res) => {
  try {
    const buyerId = req.user.id;

    const purchases = await BuyerPurchase.find({ buyer: buyerId })
      .populate("farmer", "name phone location")
      .populate("crop", "cropName cropType images pricePerKg")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      purchases,
    });
  } catch (error) {
    console.error("Get Buyer Purchases Error:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch purchases" });
  }
};