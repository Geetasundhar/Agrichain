const Land = require("../models/Land");
const User = require("../models/User");
const { 
  registerLandOnBlockchain, 
  getLandFromBlockchain,
  getFarmerLandsFromBlockchain,
  updateLandHashOnBlockchain,
  generateLandDataHash 
} = require("../blockchain/landBlockchainService");

exports.addLand = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const { farmName, farmAddress, areaInAcres, coordinates, soilType } = req.body;

    // Validate all required fields
    if (!farmName || !farmAddress || !areaInAcres || !coordinates) {
      return res.status(400).json({
        message: "All land details are required (farmName, farmAddress, areaInAcres, coordinates)",
      });
    }

    // Validate coordinates format
    if (!Array.isArray(coordinates) || coordinates.length < 3) {
      return res.status(400).json({
        message: "Coordinates must be an array with at least 3 points",
      });
    }

    // Check farmer exists
    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Count farmer lands
    const landCount = await Land.countDocuments({ farmer: farmerId });
    const isPrimaryLand = landCount === 0;

    // Create land with proper GeoJSON format
    const newLand = new Land({
      farmer: farmerId,
      farmName,
      farmAddress,
      areaInAcres: parseFloat(areaInAcres),
      soilType: soilType || "Not specified",
      location: {
        type: "Polygon",
        coordinates: [coordinates], // GeoJSON requires array of coordinate arrays
      },
      isPrimary: isPrimaryLand,
    });

    await newLand.save();

    // Register land on blockchain
    let blockchainResult = {
      success: false,
      error: "Blockchain registration skipped - contract not deployed",
    };
    
    try {
      blockchainResult = await registerLandOnBlockchain(farmer.walletAddress || farmer._id.toString(), newLand);
      console.log("Blockchain result:", blockchainResult);
      
      if (blockchainResult.success) {
        console.log("✅ Blockchain registration successful, updating land document...");
        // Update land document with blockchain details
        newLand.blockchainLandId = blockchainResult.landId;
        newLand.dataHash = blockchainResult.dataHash;
        newLand.transactionHash = blockchainResult.transactionHash;
        newLand.blockNumber = blockchainResult.blockNumber;
        newLand.isRegisteredOnBlockchain = true;
        await newLand.save();
        console.log("✅ Land document updated with blockchain details");
      } else {
        console.warn("⚠️ Blockchain registration failed:", blockchainResult.error);
      }
    } catch (blockchainError) {
      console.warn("Blockchain registration warning:", blockchainError.message);
      blockchainResult = {
        success: false,
        error: blockchainError.message,
      };
    }

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
      blockchainStatus: blockchainResult,
    });

  } catch (error) {
    console.error("Add Land Error:", error);
    console.error("Error details:", error.message);
    res.status(500).json({
      message: "Server error while adding land",
      error: error.message, // Include error details for debugging
    });
  }
};

/**
 * Get all lands for a farmer
 */
exports.getFarmerLands = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const lands = await Land.find({ farmer: farmerId })
      .populate("farmer", "name email walletAddress")
      .sort({ isPrimary: -1, createdAt: -1 });

    res.status(200).json({
      message: "Lands retrieved successfully",
      count: lands.length,
      lands,
    });
  } catch (error) {
    console.error("Get Farmer Lands Error:", error);
    res.status(500).json({
      message: "Server error while retrieving lands",
      error: error.message,
    });
  }
};

/**
 * Get a single land by ID
 */
exports.getLandById = async (req, res) => {
  try {
    const { landId } = req.params;
    const farmerId = req.user.id;

    const land = await Land.findById(landId).populate("farmer", "name email walletAddress");

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    // Check if farmer owns this land
    if (land.farmer._id.toString() !== farmerId) {
      return res.status(403).json({ message: "You don't have access to this land" });
    }

    res.status(200).json({
      message: "Land retrieved successfully",
      land,
    });
  } catch (error) {
    console.error("Get Land By ID Error:", error);
    res.status(500).json({
      message: "Server error while retrieving land",
      error: error.message,
    });
  }
};

/**
 * Get blockchain data for a land
 */
exports.getLandBlockchainData = async (req, res) => {
  try {
    const { landId } = req.params;
    const farmerId = req.user.id;

    const land = await Land.findById(landId);

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    // Check if farmer owns this land
    if (land.farmer.toString() !== farmerId) {
      return res.status(403).json({ message: "You don't have access to this land" });
    }

    if (!land.isRegisteredOnBlockchain) {
      return res.status(400).json({
        message: "This land is not registered on blockchain",
        land: {
          _id: land._id,
          farmName: land.farmName,
          blockchainStatus: "Not registered",
        },
      });
    }

    // Get data from blockchain
    const blockchainData = await getLandFromBlockchain(land.blockchainLandId);

    res.status(200).json({
      message: "Blockchain data retrieved successfully",
      local: {
        _id: land._id,
        blockchainLandId: land.blockchainLandId,
        dataHash: land.dataHash,
        transactionHash: land.transactionHash,
        blockNumber: land.blockNumber,
      },
      blockchain: blockchainData.success ? blockchainData.land : null,
      blockchainError: !blockchainData.success ? blockchainData.error : null,
    });
  } catch (error) {
    console.error("Get Land Blockchain Data Error:", error);
    res.status(500).json({
      message: "Server error while retrieving blockchain data",
      error: error.message,
    });
  }
};

/**
 * Update land and re-register hash on blockchain
 */
exports.updateLand = async (req, res) => {
  try {
    const { landId } = req.params;
    const farmerId = req.user.id;
    const { farmName, farmAddress, areaInAcres, coordinates, soilType } = req.body;

    const land = await Land.findById(landId);

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    // Check if farmer owns this land
    if (land.farmer.toString() !== farmerId) {
      return res.status(403).json({ message: "You don't have access to this land" });
    }

    // Update land fields
    if (farmName) land.farmName = farmName;
    if (farmAddress) land.farmAddress = farmAddress;
    if (areaInAcres) land.areaInAcres = parseFloat(areaInAcres);
    if (soilType) land.soilType = soilType;
    if (coordinates && Array.isArray(coordinates) && coordinates.length >= 3) {
      land.location = {
        type: "Polygon",
        coordinates: [coordinates],
      };
    }

    await land.save();

    // Update hash on blockchain if registered
    let blockchainResult = { success: false, message: "No blockchain update" };
    
    if (land.isRegisteredOnBlockchain) {
      try {
        blockchainResult = await updateLandHashOnBlockchain(land.blockchainLandId, land);
        
        if (blockchainResult.success) {
          land.dataHash = blockchainResult.dataHash;
          land.transactionHash = blockchainResult.transactionHash;
          await land.save();
        }
      } catch (blockchainError) {
        console.warn("Blockchain update warning:", blockchainError.message);
        blockchainResult = {
          success: false,
          error: blockchainError.message,
        };
      }
    }

    res.status(200).json({
      message: "Land updated successfully",
      land,
      blockchainStatus: blockchainResult,
    });
  } catch (error) {
    console.error("Update Land Error:", error);
    res.status(500).json({
      message: "Server error while updating land",
      error: error.message,
    });
  }
};

/**
 * Get land hash verification
 */
exports.verifyLandHash = async (req, res) => {
  try {
    const { landId } = req.params;
    const farmerId = req.user.id;

    const land = await Land.findById(landId);

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    // Check if farmer owns this land
    if (land.farmer.toString() !== farmerId) {
      return res.status(403).json({ message: "You don't have access to this land" });
    }

    // Recalculate hash
    const recalculatedHash = generateLandDataHash({
      farmName: land.farmName,
      farmAddress: land.farmAddress,
      areaInAcres: land.areaInAcres,
      location: land.location,
      timestamp: land.updatedAt.toISOString(),
    });

    const isValid = recalculatedHash === land.dataHash;

    res.status(200).json({
      message: "Hash verification completed",
      landId: land._id,
      farmName: land.farmName,
      storedHash: land.dataHash,
      recalculatedHash,
      isValid,
      blockchainRegistered: land.isRegisteredOnBlockchain,
      blockchainLandId: land.blockchainLandId,
      transactionHash: land.transactionHash,
    });
  } catch (error) {
    console.error("Verify Land Hash Error:", error);
    res.status(500).json({
      message: "Server error while verifying land hash",
      error: error.message,
    });
  }
};

/**
 * Get all farmer lands from blockchain
 */
exports.getFarmerBlockchainLands = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Get lands from blockchain
    const blockchainResult = await getFarmerLandsFromBlockchain(farmer.walletAddress || farmerId);

    if (!blockchainResult.success) {
      return res.status(400).json({
        message: "Error retrieving blockchain lands",
        error: blockchainResult.error,
      });
    }

    // Get corresponding local lands
    const localLands = await Land.find({ 
      farmer: farmerId,
      blockchainLandId: { $in: blockchainResult.landIds }
    });

    res.status(200).json({
      message: "Blockchain lands retrieved successfully",
      blockchainLandCount: blockchainResult.count,
      blockchainLandIds: blockchainResult.landIds,
      localLands,
    });
  } catch (error) {
    console.error("Get Farmer Blockchain Lands Error:", error);
    res.status(500).json({
      message: "Server error while retrieving blockchain lands",
      error: error.message,
    });
  }
};

/**
 * Delete a land
 */
exports.deleteLand = async (req, res) => {
  try {
    const { landId } = req.params;
    const farmerId = req.user.id;

    const land = await Land.findById(landId);

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    // Check if farmer owns this land
    if (land.farmer.toString() !== farmerId) {
      return res.status(403).json({ message: "You don't have access to this land" });
    }

    // Delete the land
    await Land.findByIdAndDelete(landId);

    res.status(200).json({
      message: "Land deleted successfully",
      deletedLandId: landId,
      note: "Data on blockchain remains immutable",
    });
  } catch (error) {
    console.error("Delete Land Error:", error);
    res.status(500).json({
      message: "Server error while deleting land",
      error: error.message,
    });
  }
};
