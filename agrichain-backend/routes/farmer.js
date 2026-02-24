const express = require("express");
const { addCrop, getAllCrops, getCropById, getStorageReport, getMyCrops, updateCrop, deleteCrop } = require("../controllers/farmerController.js");
const { authMiddleware } = require("../middleware/auth.js"); // JWT auth
const { getUserProfile, updateUserProfile } = require("../controllers/userController.js");
const productController = require("../controllers/productController");

const router = express.Router();

// Protected route - farmer must be logged in
router.post("/add-crop", authMiddleware, addCrop);

// purchase / inventory routes
router.post("/buy-product", authMiddleware, productController.buyProduct);
router.get("/my-purchases", authMiddleware, productController.getMyPurchases);
router.get("/purchased-products-by-type", authMiddleware, productController.getPurchasedProductsByType);
// handy helper to check a product id before using it in crop registration
router.get("/verify-product/:id", authMiddleware, productController.getProductByProductId);



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