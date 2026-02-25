const mongoose = require("mongoose");

const landSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },

    farmName: {
      type: String,
      required: true,
    },

    farmAddress: {
      type: String,
      required: true,
    },

    areaInAcres: {
      type: Number,
      required: false,
    },

    location: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: false,
      },
      coordinates: {
        type: [[[Number]]], // GeoJSON Polygon
        required: false,
      },
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Geo index (VERY IMPORTANT)
landSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Land", landSchema);
