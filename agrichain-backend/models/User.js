const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    phone: { type: String },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🖼️ Profile photo
    photo: { type: String },

    // 🚜 To track geofencing completion (for farmers)
    isFarmLocationAdded: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
