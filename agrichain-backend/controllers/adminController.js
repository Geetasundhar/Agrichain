const User = require("../models/User");
const Retailer = require("../models/Retailer");

// Buyer model uses ESM, so we use a dynamic import helper
let Buyer = null;
const loadBuyer = async () => {
    if (!Buyer) {
        const mod = await import("../models/buyeruser.js");
        Buyer = mod.default;
    }
    return Buyer;
};

// Get counts of all user types
exports.getCounts = async (req, res) => {
    try {
        const BuyerModel = await loadBuyer();
        const [farmerCount, buyerCount, retailerCount] = await Promise.all([
            User.countDocuments(),
            BuyerModel.countDocuments(),
            Retailer.countDocuments(),
        ]);

        res.status(200).json({
            farmers: farmerCount,
            buyers: buyerCount,
            retailers: retailerCount,
        });
    } catch (error) {
        console.error("Get counts error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===== FARMERS =====
exports.getAllFarmers = async (req, res) => {
    try {
        const farmers = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(farmers);
    } catch (error) {
        console.error("Get farmers error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteFarmer = async (req, res) => {
    try {
        const farmer = await User.findByIdAndDelete(req.params.id);
        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }
        res.status(200).json({ message: "Farmer deleted successfully" });
    } catch (error) {
        console.error("Delete farmer error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===== BUYERS =====
exports.getAllBuyers = async (req, res) => {
    try {
        const BuyerModel = await loadBuyer();
        const buyers = await BuyerModel.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(buyers);
    } catch (error) {
        console.error("Get buyers error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteBuyer = async (req, res) => {
    try {
        const BuyerModel = await loadBuyer();
        const buyer = await BuyerModel.findByIdAndDelete(req.params.id);
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }
        res.status(200).json({ message: "Buyer deleted successfully" });
    } catch (error) {
        console.error("Delete buyer error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===== RETAILERS =====
exports.getAllRetailers = async (req, res) => {
    try {
        const retailers = await Retailer.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(retailers);
    } catch (error) {
        console.error("Get retailers error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteRetailer = async (req, res) => {
    try {
        const retailer = await Retailer.findByIdAndDelete(req.params.id);
        if (!retailer) {
            return res.status(404).json({ message: "Retailer not found" });
        }
        res.status(200).json({ message: "Retailer deleted successfully" });
    } catch (error) {
        console.error("Delete retailer error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
