const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// 🔹 Import Routes
const authRoutes = require("./routes/auth");
const farmerRoutes = require("./routes/farmer");
const buyerRoutes = require("./routes/buyerRoutes");
const buyerProfileRoutes = require("./routes/buyerProfileRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/auth", authRoutes);
app.use("/farmer", farmerRoutes);
app.use("/buyer", buyerRoutes);
app.use("/buyer", buyerProfileRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🌾 AgriChain API is running successfully!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
