const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  farm_name: { type: String },
  farm_address: { type: String },
  farm_size: { type: Number },
  crop_type: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🖼️ New field for profile photo
  photo: { type: String }, // can store image URL or Base64 string
});

module.exports = mongoose.model("User", userSchema);
