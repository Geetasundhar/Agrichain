const express = require("express");
const router = express.Router();
const retailerController = require("../controllers/retailerController");
const productController = require("../controllers/productController");
const { authMiddleware } = require("../middleware/auth");

// Retailer signup
router.post("/signup", retailerController.signup);

// Retailer login
router.post("/login", retailerController.login);

// ===== product management =====
// add a new product (seed/fertilizer)
router.post("/product", authMiddleware, productController.addProduct);

// list products owned by the logged‑in retailer
router.get("/products", authMiddleware, productController.getMyProducts);

// view purchases of your inventory
router.get("/purchases", authMiddleware, productController.getRetailerPurchases);

// public endpoints for product browsing/verification
router.get("/all-products", productController.getAllProducts);
router.get("/product/:id", productController.getProductByProductId); // :id = productId field

module.exports = router;