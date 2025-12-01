import Buyer from "../models/buyeruser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔹 Buyer Signup
export const signupBuyer = async (req, res) => {
  try {
    const { buyer_name, business_name, district, phone, email, username, password } = req.body;

    // Validation
    if (!buyer_name || !business_name || !district || !phone || !email || !username || !password) {
      return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    // Check existing email or username
    const existing = await Buyer.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ status: "error", message: "Email or Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newBuyer = new Buyer({
      buyer_name,
      business_name,
      district,
      phone,
      email,
      username,
      password: hashedPassword,
    });

    await newBuyer.save();

    res.status(201).json({ status: "success", message: "Buyer registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
};

// 🔹 Buyer Login (using username instead of email)
export const loginBuyer = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ status: "error", message: "Username and password are required" });

    const buyer = await Buyer.findOne({ username });
    if (!buyer) return res.status(404).json({ status: "error", message: "Buyer not found" });

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) return res.status(400).json({ status: "error", message: "Invalid credentials" });

    const token = jwt.sign(
      { id: buyer._id, username: buyer.username, role: "buyer" },
      process.env.JWT_SECRET || "MY_SECRET_KEY",
      { expiresIn: "1d" }
    );

    // ✅ Send consistent, predictable structure
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      buyer: {
        _id: buyer._id,
        buyer_name: buyer.buyer_name,
        business_name: buyer.business_name,
        district: buyer.district,
        phone: buyer.phone,
        email: buyer.email,
        username: buyer.username,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
};
