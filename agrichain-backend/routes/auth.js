const express = require("express");
const router = express.Router();
const { signup , login } = require("../controllers/authController");
const { addLand } = require("../controllers/landController")
const { authMiddleware } = require("../middleware/auth");

// Signup Route
router.post("/signup", signup);
// Login Route
router.post("/login", login);
router.post("/add-land", authMiddleware, addLand);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});
module.exports = router;
