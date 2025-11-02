const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

// 🧠 Fetch user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    // If password provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // If profile image (Base64) provided
    if (image) {
      user.image = image; // store as Base64 directly
    }

    const updatedUser = await user.save();
    res.json({
      message: "Profile updated successfully",
      user: { ...updatedUser._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile, updateUserProfile };
