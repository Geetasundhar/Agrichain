const express = require("express");
const router = express.Router();
const contract = require("../blockchain/contract");

router.post("/register", async (req, res) => {
  try {
    const { cropName, quantity, price } = req.body;

    const tx = await contract.registerCrop(cropName, quantity, price);
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
