const express = require("express");
const router = express.Router();
const { signup , login } = require("../controllers/authController");
const { addLand } = require("../controllers/landController")
const { authMiddleware } = require("../middleware/auth");
const User = require("../models/User");

// Signup Route
router.post("/signup", signup);
// Login Route
router.post("/login", login);
router.post("/add-land", authMiddleware, addLand);

// Get current user - with full data including isFarmLocationAdded
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
