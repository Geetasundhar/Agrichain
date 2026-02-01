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

const cropRoutes = require("./routes/cropRoutes");

const app = express();

// 🔹 Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 🔹 Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Connect DB
connectDB();

// 🔹 Routes
app.use("/auth", authRoutes);
app.use("/farmer", farmerRoutes);
app.use("/buyer", buyerRoutes);
app.use("/buyer/profile", buyerProfileRoutes);

//blockchain route
app.use("/api/crops", cropRoutes);

// 🔹 Health Check
app.get("/", (req, res) => {
  res.send("🌾 AgriChain API is running successfully!");
});

// 🔹 Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
