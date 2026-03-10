const express = require("express");
const router = express.Router();
const {
    getCounts,
    getAllFarmers,
    getAllBuyers,
    getAllRetailers,
    deleteFarmer,
    deleteBuyer,
    deleteRetailer,
} = require("../controllers/adminController");

// Dashboard counts
router.get("/counts", getCounts);

// List all users by type
router.get("/farmers", getAllFarmers);
router.get("/buyers", getAllBuyers);
router.get("/retailers", getAllRetailers);

// Delete user by type and ID
router.delete("/farmer/:id", deleteFarmer);
router.delete("/buyer/:id", deleteBuyer);
router.delete("/retailer/:id", deleteRetailer);

module.exports = router;
