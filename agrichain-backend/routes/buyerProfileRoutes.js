const express = require("express");
const multer = require("multer");
const { getBuyerProfile, updateBuyerProfile } = require("../controllers/buyerProfileController");

const router = express.Router();

// ✅ Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Routes
router.get("/profile/:id", getBuyerProfile);
router.put("/profile/:id", upload.single("profile_image"), updateBuyerProfile);

module.exports = router;
