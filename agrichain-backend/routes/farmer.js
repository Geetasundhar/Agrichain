const express = require("express");
const { addCrop, getAllCrops, getCropById } = require("../controllers/farmerController.js");
const { authMiddleware } = require("../middleware/auth.js"); // JWT auth
const { getUserProfile, updateUserProfile } = require("../controllers/userController.js");

const router = express.Router();

// Protected route - farmer must be logged in
router.post("/add-crop", authMiddleware, addCrop);

// Get all crops
router.get("/crops", getAllCrops);

// Get single crop by ID (used when QR is scanned)
router.get("/crops/:id", getCropById);

router.get("/profile", authMiddleware, getUserProfile);

// Update logged-in user's profile
router.put("/profile", authMiddleware, updateUserProfile);

module.exports = router;
