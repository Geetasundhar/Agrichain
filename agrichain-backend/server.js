const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const farmerRoutes = require("./routes/farmer");  
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
connectDB();
// Middleware
app.use(express.json());
// Routes
app.use("/auth", authRoutes);
app.use("/farmer", farmerRoutes);
// Start Server
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
