const express = require("express");
const { addCrop , getAllCrops, getCropById} = require("../controllers/farmerController.js");
const { authMiddleware } = require("../middleware/auth.js"); // JWT auth

const router = express.Router();

// Protected route - farmer must be logged in
router.post("/add-crop", authMiddleware, addCrop);

router.get("/crops", getAllCrops);

router.get("/crops/:id", getCropById);

module.exports = router;
