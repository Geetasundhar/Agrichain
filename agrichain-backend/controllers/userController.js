const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🧠 Fetch user profile
const getUserProfile = async (req, res) => {
  try {
    // req.user.id is set by authMiddleware.js
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// 🧩 Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      photo,
      farm_address,
      farm_size,
      crop_type,
      phone,
      age,
    } = req.body;

    // Find user using token-based id
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Update fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (age) user.age = age;
    if (farm_address) user.farm_address = farm_address;
    if (farm_size) user.farm_size = farm_size;
    if (crop_type) user.crop_type = crop_type;

    // 🧂 Update password if new one provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 🖼️ Update photo if provided (Base64 or URL)
    if (photo) {
      user.photo = photo;
    }

    // Save updated user
    const updatedUser = await user.save();

    // Send response excluding password
    res.status(200).json({
      message: "✅ Profile updated successfully",
      user: {
        ...updatedUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
