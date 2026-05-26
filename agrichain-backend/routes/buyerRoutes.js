const express = require("express");
const { signupBuyer, loginBuyer, getBuyerProfile } = require("../controllers/buyerController.js");
const { getAllCropsForBuyer, buyCrop, getSingleCropForBuyer, getBuyerPurchases, getAllPreOrderableCrops, placePreOrder, getBuyerPreOrders, addFeedback } = require("../controllers/buyerCropController.js");
const { authMiddleware } = require("../middleware/auth.js");


const router = express.Router();


router.post("/signup", signupBuyer);

router.post("/login", loginBuyer);

router.get("/profile/:id", authMiddleware, getBuyerProfile);

router.get("/crops", authMiddleware, getAllCropsForBuyer);
router.get("/crops/:id", authMiddleware, getSingleCropForBuyer);
router.post("/crops/:id/feedback", authMiddleware, addFeedback);

router.get("/my-purchases", authMiddleware, getBuyerPurchases);

router.post("/buy-crop", authMiddleware, buyCrop);

// Pre-Order routes
router.get("/preorder-crops", authMiddleware, getAllPreOrderableCrops);
router.post("/place-preorder", authMiddleware, placePreOrder);
router.get("/my-preorders", authMiddleware, getBuyerPreOrders);


module.exports = router;
