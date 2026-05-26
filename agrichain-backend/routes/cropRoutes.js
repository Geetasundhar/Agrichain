const express = require("express");
const router = express.Router();
const contract = require("../blockchain/contract");

router.post("/register", async (req, res) => {
  try {
    const {
      cropName,
      cropType,
      category,
      pricePerKg,
      quantityKg,
      durationNumber,
      durationPeriod,
      soilType
    } = req.body;

    // Basic validation (optional but recommended)
    if (
      !cropName ||
      !cropType ||
      !category ||
      !pricePerKg ||
      !quantityKg ||
      !durationNumber ||
      !durationPeriod ||
      !soilType
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const tx = await contract.registerCrop(
      cropName,
      cropType,
      category,
      pricePerKg,
      quantityKg,
      durationNumber,
      durationPeriod,
      soilType
    );

    await tx.wait();

    res.json({
      message: "Crop registered on blockchain",
      txHash: tx.hash,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blockchain transaction failed" });
  }
});

module.exports = router;