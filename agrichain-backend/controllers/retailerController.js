const Retailer = require("../models/Retailer");
const RetailerOrganization = require("../models/RetailerOrganization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Retailer Signup Controller
exports.signup = async (req, res) => {
  try {
    console.log("🔍 Raw req.body:", req.body);

    const {
      name,
      email,
      password,
      shop_image,
      licenses, // { seed: "license_number", fertilizer: "license_number" }
    } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check if email already exists
    const existingRetailer = await Retailer.findOne({ email });
    if (existingRetailer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Verify licenses
    let verifiedSeed = false;
    let verifiedFertilizer = false;
    let organization = null;

    if (licenses) {
      if (licenses.seed) {
        const orgSeed = await RetailerOrganization.findOne({ seed_licenseNumber: licenses.seed });
        if (orgSeed) {
          verifiedSeed = true;
          organization = orgSeed._id;
        }
      }
      if (licenses.fertilizer) {
        const orgFert = await RetailerOrganization.findOne({ fertilizer_licenseNumber: licenses.fertilizer });
        if (orgFert) {
          verifiedFertilizer = true;
          if (!organization) organization = orgFert._id;
          // If both, assume same org or handle accordingly
        }
      }
    }

    // If no licenses verified, perhaps allow signup but mark as unverified
    // For now, require at least one verification
    if (!verifiedSeed && !verifiedFertilizer) {
      return res.status(400).json({ message: "At least one license must be verified" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new retailer
    const newRetailer = new Retailer({
      name,
      email,
      password: hashedPassword,
      shop_image,
      verified_licenses: {
        seed: verifiedSeed,
        fertilizer: verifiedFertilizer,
      },
      organization,
    });

    await newRetailer.save();

    // Generate JWT (similar to authController)
    const token = jwt.sign(
      { id: newRetailer._id, email: newRetailer.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Retailer registered successfully",
      token,
      retailer: {
        id: newRetailer._id,
        name: newRetailer.name,
        email: newRetailer.email,
        verified_licenses: newRetailer.verified_licenses,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Retailer Login Controller
exports.login = async (req, res) => {
  try {
    console.log("🔍 Login attempt with:", req.body);

    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find retailer by email
    const retailer = await Retailer.findOne({ email });
    if (!retailer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, retailer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: retailer._id, email: retailer.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      retailer: {
        id: retailer._id,
        name: retailer.name,
        email: retailer.email,
        verified_licenses: retailer.verified_licenses,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};