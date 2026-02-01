const express = require("express");
const { signupBuyer, loginBuyer } = require("../controllers/buyerController.js");
const { getAllCropsForBuyer,  buyCrop} = require("../controllers/buyerCropController.js");
const { authMiddleware } = require("../middleware/auth.js");


const router = express.Router();


router.post("/signup", signupBuyer);

router.post("/login", loginBuyer);

router.get("/crops", authMiddleware,getAllCropsForBuyer);

router.post("/buy-crop", buyCrop);


module.exports = router;
