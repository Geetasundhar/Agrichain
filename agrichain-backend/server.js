const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const farmerRoutes = require("./routes/farmer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Connect Database
connectDB();

// ✅ Middleware with larger body size limit (for Base64 photo uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/farmer", farmerRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
