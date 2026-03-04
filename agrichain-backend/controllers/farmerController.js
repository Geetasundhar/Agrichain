import Crop from "../models/Crop.js";
import Farmer from "../models/User.js";
import QRCode from "qrcode"; // npm install qrcode
import Land from "../models/Land.js";
import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";

// ➤ Add crop (with QR code generation)
export const addCrop = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const {
      name,
      type,
      quantity,
      price,
      durationNumber,
      durationPeriod,
      soilType,
      image,
      latitude,
      longitude,
      seedProductId,
      fertilizerProductId,
      seedQuantityUsed,
      fertilizerQuantityUsed
    } = req.body;

    // 🛑 Validate crop fields
    if (
      !name ||
      !type ||
      !durationNumber ||
      !durationPeriod ||
      !soilType ||
      !image ||
      !seedProductId ||
      !fertilizerProductId
    ) {
      return res.status(400).json({
        status: "error",
        message: "Crop name, type, duration, soil type, seed product, fertilizer product, and image are required",
      });
    }

    // 👨‍🌾 Check farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        status: "error",
        message: "Farmer not found",
      });
    }

    // ✅ verify seed/fertilizer product ids if provided and validate quantities
    let seedProductRef, fertProductRef;
    if (seedProductId) {
      const product = await Product.findOne({ productId: seedProductId });
      if (!product) {
        return res.status(400).json({ status: "error", message: "Invalid seed product id" });
      }
      // confirm farmer purchased this product
      const purchase = await Purchase.findOne({ product: product._id, farmer: farmerId });
      if (!purchase) {
        return res.status(403).json({ status: "error", message: "You have not bought the seed with this product id" });
      }
      // validate quantity
      const seedQtyToUse = Number(seedQuantityUsed) || 0;
      if (seedQtyToUse <= 0) {
        return res.status(400).json({ status: "error", message: "Seed quantity must be greater than 0" });
      }
      if (seedQtyToUse > purchase.quantity) {
        return res.status(400).json({ status: "error", message: `You have only ${purchase.quantity} units of this seed. Cannot use ${seedQtyToUse}` });
      }
      seedProductRef = product._id;
    }
    if (fertilizerProductId) {
      const product = await Product.findOne({ productId: fertilizerProductId });
      if (!product) {
        return res.status(400).json({ status: "error", message: "Invalid fertilizer product id" });
      }
      const purchase = await Purchase.findOne({ product: product._id, farmer: farmerId });
      if (!purchase) {
        return res.status(403).json({ status: "error", message: "You have not bought the fertilizer with this product id" });
      }
      // validate quantity
      const fertQtyToUse = Number(fertilizerQuantityUsed) || 0;
      if (fertQtyToUse <= 0) {
        return res.status(400).json({ status: "error", message: "Fertilizer quantity must be greater than 0" });
      }
      if (fertQtyToUse > purchase.quantity) {
        return res.status(400).json({ status: "error", message: `You have only ${purchase.quantity} units of this fertilizer. Cannot use ${fertQtyToUse}` });
      }
      fertProductRef = product._id;
    }

    // 🌾 Create crop
    const newCrop = await Crop.create({
      farmerId,
      cropName: name,
      cropType: type,
      quantityKg: quantity || 0,
      pricePerKg: price || 0,
      durationNumber,
      durationPeriod,
      soilType,
      images: [image],
      seedProduct: seedProductRef,
      fertilizerProduct: fertProductRef,
      seedQuantityUsed: Number(seedQuantityUsed) || 0,
      fertilizerQuantityUsed: Number(fertilizerQuantityUsed) || 0,
    });

    // 📉 Decrement purchase quantities and remove zero-quantity purchases
    if (seedProductId) {
      const seedQtyToUse = Number(seedQuantityUsed) || 0;
      const seedProduct = await Product.findOne({ productId: seedProductId });
      const seedPurchase = await Purchase.findOne({ product: seedProduct._id, farmer: farmerId });
      if (seedPurchase) {
        seedPurchase.quantity -= seedQtyToUse;
        if (seedPurchase.quantity <= 0) {
          await Purchase.deleteOne({ _id: seedPurchase._id });
        } else {
          await seedPurchase.save();
        }
      }
    }
    if (fertilizerProductId) {
      const fertQtyToUse = Number(fertilizerQuantityUsed) || 0;
      const fertProduct = await Product.findOne({ productId: fertilizerProductId });
      const fertPurchase = await Purchase.findOne({ product: fertProduct._id, farmer: farmerId });
      if (fertPurchase) {
        fertPurchase.quantity -= fertQtyToUse;
        if (fertPurchase.quantity <= 0) {
          await Purchase.deleteOne({ _id: fertPurchase._id });
        } else {
          await fertPurchase.save();
        }
      }
    }

    // 📦 QR Details
    const qrDetails = [
      `🌾 FARMER DETAILS`,
      `---------------------------`,
      `Name     : ${farmer.name}`,
      `Phone    : ${farmer.phone}`,
      `Email    : ${farmer.email}`,
      ``,
      `🌱 CROP DETAILS`,
      `---------------------------`,
      `Crop Name  : ${name}`,
      `Crop Type  : ${type}`,
      `Quantity   : ${quantity || 0} kg`,
      `Price/kg   : ₹${price || 0}`,
      `Duration   : ${durationNumber} ${durationPeriod}`,
      `Soil Type  : ${soilType}`,
      `Added On   : ${new Date().toLocaleDateString()}`,
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
        durationNumber: newCrop.durationNumber,
        durationPeriod: newCrop.durationPeriod,
        fertilizer: newCrop.fertilizer,
        soilType: newCrop.soilType,
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
    // ✅ Fetch crops and populate farmer name & email and product refs
    const crops = await Crop.find()
      .populate("farmerId", "name email")
      .populate("seedProduct", "productId productName")
      .populate("fertilizerProduct", "productId productName");

    // ✅ Format data to match your frontend
    const formatted = crops.map(c => ({
      _id: c._id,
      name: c.cropName, // corrected
      type: c.cropType, // corrected
      quantity: c.quantityKg, // corrected
      price: c.pricePerKg, // corrected
      durationNumber: c.durationNumber,
      durationPeriod: c.durationPeriod,
      fertilizer: c.fertilizer,
      soilType: c.soilType,
      seedProduct: c.seedProduct || null,
      fertilizerProduct: c.fertilizerProduct || null,
      image: c.images && c.images.length > 0 ? c.images[0] : null, // show first image
      farmerName: c.farmerId?.name || "Unknown Farmer",
      quality: Math.floor(Math.random() * 5) + 1, // ⭐ random rating
      isCompleted: c.isCompleted,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching crops:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ➤ Get crop by ID
// export const getCropById = async (req, res) => {
//   try {
//     const crop = await Crop.findById(req.params.id).populate("farmerId", "name email phone location");
//     if (!crop) {
//       return res.status(404).json({ status: "error", message: "Crop not found" });
//     }
//     res.status(200).json({ status: "success", crop });
//   } catch (err) {
//     console.error("Get Crop By ID Error:", err);
//     res.status(500).json({ status: "error", message: "Server error" });
//   }
// };

export const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        status: "error",
        message: "Crop not found"
      });
    }

    res.status(200).json({
      status: "success",
      crop
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
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




// ➤ Get crops of logged-in farmer
export const getMyCrops = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const crops = await Crop.find({ farmerId })
      .populate("seedProduct", "productId productName")
      .populate("fertilizerProduct", "productId productName");

    const formatted = crops.map(c => ({
      _id: c._id,
      name: c.cropName,
      type: c.cropType,
      quantity: c.quantityKg,
      price: c.pricePerKg,
      durationNumber: c.durationNumber,
      durationPeriod: c.durationPeriod,
      fertilizer: c.fertilizer,
      soilType: c.soilType,
      seedProduct: c.seedProduct || null,
      fertilizerProduct: c.fertilizerProduct || null,
      image: c.images?.[0] || null,
      qrCode: c.qrCode,
      isCompleted: c.isCompleted,
    }));

    res.status(200).json({
      status: "success",
      crops: formatted
    });

  } catch (err) {
    console.error("Get My Crops Error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};



// ➤ Update crop (quantity, price, improvements)
export const updateCrop = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const cropId = req.params.id;

    const { quantity, price, durationNumber, durationPeriod, fertilizer, soilType, newImage } = req.body;

    const crop = await Crop.findOne({ _id: cropId, farmerId });

    if (!crop) {
      return res.status(404).json({
        status: "error",
        message: "Crop not found or unauthorized",
      });
    }

    if (quantity !== undefined) crop.quantityKg = quantity;
    if (price !== undefined) crop.pricePerKg = price;
    if (durationNumber !== undefined) crop.durationNumber = durationNumber;
    if (durationPeriod !== undefined) crop.durationPeriod = durationPeriod;
    if (fertilizer !== undefined) crop.fertilizer = fertilizer;
    if (soilType !== undefined) crop.soilType = soilType;

    // 🌱 Handle progress photo upload with period validation
    if (newImage) {
      // compute total days based on duration
      const n = Number(crop.durationNumber || 0);
      const p = crop.durationPeriod;
      let totalDays = 0;
      if (p === "week") totalDays = n * 7;
      else if (p === "month") totalDays = n * 30;
      else if (p === "year") totalDays = n * 365;

      const start = crop.createdAt || (crop._id && crop._id.getTimestamp && crop._id.getTimestamp());
      const now = new Date();

      if (!start || !totalDays) {
        return res.status(400).json({ status: "error", message: "Invalid crop start or duration" });
      }

      // compute period ranges (4 equal parts)
      const periodLength = totalDays / 4; // may be fractional
      const periodStarts = [];
      for (let i = 0; i < 4; i++) {
        const s = new Date(start.getTime() + Math.round(i * periodLength) * 24 * 60 * 60 * 1000);
        periodStarts.push(s);
      }
      const periodEnds = [];
      for (let i = 0; i < 4; i++) {
        const e = new Date(start.getTime() + Math.round((i + 1) * periodLength) * 24 * 60 * 60 * 1000);
        periodEnds.push(e);
      }

      // determine current period index
      let currentIdx = 0;
      for (let i = 0; i < 4; i++) {
        if (now >= periodStarts[i] && now < periodEnds[i]) {
          currentIdx = i;
          break;
        }
        // if after all ends, allow last period
        if (i === 3 && now >= periodEnds[3]) currentIdx = 3;
      }

      // check if photo already exists for this period
      const already = (crop.progressPhotos || []).some(p => p.periodIndex === currentIdx);
      if (already) {
        // provide next available time
        const nextIdx = currentIdx + 1;
        if (nextIdx < 4) {
          return res.status(400).json({ status: "error", message: "You have already captured for this period. You can capture next after " + periodStarts[nextIdx].toISOString() });
        } else {
          return res.status(400).json({ status: "error", message: "You have already captured for this period and all periods are completed." });
        }
      }

      // check if current time is before period start
      if (now < periodStarts[currentIdx]) {
        return res.status(400).json({ status: "error", message: "Capture not allowed yet. Next capture available at " + periodStarts[currentIdx].toISOString() });
      }

      // push progress photo
      crop.progressPhotos = crop.progressPhotos || [];
      crop.progressPhotos.push({ imageData: newImage, capturedAt: new Date(), periodIndex: currentIdx });

      if (crop.progressPhotos.length >= 4) {
        crop.isCompleted = true;
      }
    }

    await crop.save();

    res.status(200).json({
      status: "success",
      message: "Crop updated successfully",
      crop, // 👈 IMPORTANT (send updated crop back)
    });

  } catch (err) {
    console.error("Update Crop Error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};




// ➤ Delete crop
export const deleteCrop = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const cropId = req.params.id;

    const crop = await Crop.findOneAndDelete({
      _id: cropId,
      farmerId
    });

    if (!crop) {
      return res.status(404).json({
        status: "error",
        message: "Crop not found or unauthorized"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Crop deleted successfully"
    });

  } catch (err) {
    console.error("Delete Crop Error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};