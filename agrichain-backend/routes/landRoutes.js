const express = require("express");
const {
  addLand,
  getFarmerLands,
  getLandById,
  updateLand,
  deleteLand,
  getLandBlockchainData,
  verifyLandHash,
  getFarmerBlockchainLands,
} = require("../controllers/landController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Protected routes - farmer must be logged in
router.post("/add", authMiddleware, addLand);

// Get all lands for current farmer
router.get("/my-lands", authMiddleware, getFarmerLands);

// Get single land by ID
router.get("/:landId", authMiddleware, getLandById);

// Get blockchain data for a specific land
router.get("/:landId/blockchain-data", authMiddleware, getLandBlockchainData);

// Verify land hash integrity
router.get("/:landId/verify-hash", authMiddleware, verifyLandHash);

// Update land and blockchain hash
router.put("/:landId", authMiddleware, updateLand);

// Delete a land
router.delete("/:landId", authMiddleware, deleteLand);

// Get all lands from blockchain for current farmer
router.get("/blockchain/my-lands", authMiddleware, getFarmerBlockchainLands);

module.exports = router;
