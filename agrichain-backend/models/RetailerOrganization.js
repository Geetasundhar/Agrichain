const mongoose = require("mongoose");

const retailerOrganizationSchema = new mongoose.Schema({
  organizationName: { type: String, required: true },
  seed_licenseNumber: { type: String, required: true, unique: true },
  fertilizer_licenseNumber: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("RetailerOrganization", retailerOrganizationSchema, "retailer_organizations");