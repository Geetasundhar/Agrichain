const express = require("express");
const { signupBuyer, loginBuyer, getBuyerProfile } = require("../controllers/buyerController.js");
const { getAllCropsForBuyer, buyCrop, getSingleCropForBuyer, getBuyerPurchases } = require("../controllers/buyerCropController.js");
const { authMiddleware } = require("../middleware/auth.js");


const router = express.Router();


router.post("/signup", signupBuyer);

router.post("/login", loginBuyer);

router.get("/profile/:id", authMiddleware, getBuyerProfile);

router.get("/crops", authMiddleware, getAllCropsForBuyer);
router.get("/crops/:id", authMiddleware, getSingleCropForBuyer);

router.get("/my-purchases", authMiddleware, getBuyerPurchases);

router.post("/buy-crop", authMiddleware, buyCrop);


module.exports = router;
