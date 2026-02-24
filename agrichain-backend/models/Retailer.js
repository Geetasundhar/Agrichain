const mongoose = require("mongoose");

const retailerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shop_image: { type: String }, // URL or path to image
  verified_licenses: {
    seed: { type: Boolean, default: false },
    fertilizer: { type: Boolean, default: false },
  },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'RetailerOrganization' }, // Reference to organization
}, { timestamps: true });

module.exports = mongoose.model("Retailer", retailerSchema);