const express = require("express");
const router = express.Router();
const retailerController = require("../controllers/retailerController");

// Retailer signup
router.post("/signup", retailerController.signup);

// Retailer login
router.post("/login", retailerController.login);

// Add other routes like profile, products, etc. if needed

module.exports = router;