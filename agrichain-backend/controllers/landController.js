const Land = require("../models/Land");
const User = require("../models/User");

exports.addLand = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const { farmName, farmAddress, areaInAcres, coordinates } = req.body;

    if (!farmName || !farmAddress || !areaInAcres || !coordinates) {
      return res.status(400).json({
        message: "All land details are required",
      });
    }

    // Check farmer exists
    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Count farmer lands (CORRECT WAY ✅)
    const landCount = await Land.countDocuments({ farmer: farmerId });

   

    const isPrimaryLand = landCount === 0;

    const newLand = new Land({
      farmer: farmerId,
      farmName,
      farmAddress,
      areaInAcres,
      location: {
        type: "Polygon",
        coordinates: [coordinates], // GeoJSON format
      },
      isPrimary: isPrimaryLand,
    });

    await newLand.save();

    // After first land, update farmer flag
    if (isPrimaryLand) {
      farmer.isFarmLocationAdded = true;
      await farmer.save();
    }

    res.status(201).json({
      message: isPrimaryLand
        ? "Primary land added successfully"
        : "Additional land added successfully",
      land: newLand,
    });

  } catch (error) {
    console.error("Add Land Error:", error);
    res.status(500).json({
      message: "Server error while adding land",
    });
  }
};
