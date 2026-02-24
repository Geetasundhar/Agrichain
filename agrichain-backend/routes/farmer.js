const express = require("express");
const { addCrop, getAllCrops, getCropById, getStorageReport, getMyCrops, updateCrop, deleteCrop } = require("../controllers/farmerController.js");
const { authMiddleware } = require("../middleware/auth.js"); // JWT auth
const { getUserProfile, updateUserProfile } = require("../controllers/userController.js");


const router = express.Router();

// Protected route - farmer must be logged in
router.post("/add-crop", authMiddleware, addCrop);


// router.get("/crops/:id", authMiddleware, getCropById);

// Farmer specific crops
router.get("/my-crops", authMiddleware, getMyCrops);

// Update crop
router.put("/update-crop/:id", authMiddleware, updateCrop);

// Delete crop
router.delete("/delete-crop/:id", authMiddleware, deleteCrop);





// Get all crops
router.get("/crops", getAllCrops);

// Get single crop by ID (used when QR is scanned)
router.get("/crops/:id", getCropById);

router.get("/profile", authMiddleware, getUserProfile);

// Update logged-in user's profile
router.put("/profile", authMiddleware, updateUserProfile);

router.get("/storage-report", authMiddleware,getStorageReport);

//buyer crops view


module.exports = router;