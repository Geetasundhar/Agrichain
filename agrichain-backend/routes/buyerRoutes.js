const express = require("express");
const { signupBuyer, loginBuyer } = require("../controllers/buyerController.js");

const router = express.Router();


router.post("/signup", signupBuyer);

router.post("/login", loginBuyer);

module.exports = router;
