const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const farmerRoutes = require("./routes/farmer");  

require("dotenv").config();
const app = express();
connectDB();


// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/farmer", farmerRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
