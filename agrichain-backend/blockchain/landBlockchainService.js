const { ethers } = require("ethers");
const landContract = require("./landContract");

/**
 * Generate a hash from land data
 * @param {Object} landData - Land data object
 * @returns {string} keccak256 hash as hex string
 */
function generateLandDataHash(landData) {
  // Create a normalized string from land data
  const dataString = JSON.stringify({
    farmName: landData.farmName,
    farmAddress: landData.farmAddress,
    areaInAcres: landData.areaInAcres,
    location: landData.location,
    timestamp: landData.timestamp || new Date().toISOString(),
  });

  // Generate keccak256 hash
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(dataString));
  return hash;
}

/**
 * Convert GeoJSON coordinates to string format for blockchain
 * @param {Object} geoJsonLocation - GeoJSON location object
 * @returns {string} Coordinates as string
 */
function formatCoordinatesToString(geoJsonLocation) {
  if (!geoJsonLocation || !geoJsonLocation.coordinates) {
    return "";
  }

  const coords = geoJsonLocation.coordinates[0]; // First polygon ring
  return coords.map(coord => `${coord[0]},${coord[1]}`).join(";");
}

/**
 * Register land on blockchain
 * @param {string} walletAddress - Farmer's wallet address
 * @param {Object} landData - Land data from database
 * @returns {Promise<Object>} Transaction receipt and land ID
 */
async function registerLandOnBlockchain(walletAddress, landData) {
  try {
    // Generate hash from land data
    const dataHash = generateLandDataHash(landData);
    console.log("✅ Hash generated:", dataHash);

    // Format coordinates
    const coordinatesString = formatCoordinatesToString(landData.location);
    console.log("✅ Coordinates formatted:", coordinatesString);

    // Prepare land data for blockchain
    const soilType = landData.soilType || "Not specified";
    console.log("📋 Land data for blockchain:", {
      farmName: landData.farmName,
      farmAddress: landData.farmAddress,
      areaInAcres: Math.floor(landData.areaInAcres),
      soilType,
    });

    // Verify contract is accessible
    console.log("🔍 Verifying contract...");
    try {
      const landCount = await landContract.landCount();
      console.log("✅ Contract accessible. Current land count:", landCount.toString());
    } catch (error) {
      console.error("❌ Contract verification failed:", error.message);
      throw new Error("Contract not found at address or not accessible. Check address and ensure Ganache is running.");
    }

    // Call smart contract method with manual gas limit
    console.log("🔗 Calling blockchain contract...");
    const tx = await landContract.registerLand(
      landData.farmName,
      landData.farmAddress,
      Math.floor(landData.areaInAcres),
      soilType,
      dataHash,
      coordinatesString,
      {
        gasLimit: 300000, // Manual gas limit to avoid estimation error
      }
    );
    console.log("✅ Transaction submitted:", tx.hash);

    // Wait for transaction confirmation
    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed at block:", receipt.blockNumber);

    // Extract landId from event logs
    const landId = receipt.events?.find(event => event.event === "LandRegistered")?.args?.landId;
    console.log("✅ Blockchain Land ID received:", landId?.toNumber());

    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      dataHash: dataHash,
      landId: landId ? landId.toNumber() : null,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    console.error("❌ Error registering land on blockchain:", error.message);
    console.error("❌ Full error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update land hash on blockchain
 * @param {number} landId - Land ID on blockchain
 * @param {Object} updatedLandData - Updated land data
 * @returns {Promise<Object>} Transaction receipt
 */
async function updateLandHashOnBlockchain(landId, updatedLandData) {
  try {
    // Generate new hash
    const newDataHash = generateLandDataHash(updatedLandData);

    // Call smart contract method
    const tx = await landContract.updateLandHash(landId, newDataHash);
    const receipt = await tx.wait();

    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      dataHash: newDataHash,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    console.error("Error updating land hash on blockchain:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get land details from blockchain
 * @param {number} landId - Land ID on blockchain
 * @returns {Promise<Object>} Land data from blockchain
 */
async function getLandFromBlockchain(landId) {
  try {
    const land = await landContract.getLand(landId);
    const location = await landContract.getLandLocation(landId);

    return {
      success: true,
      land: {
        landId: land.landId.toNumber(),
        farmName: land.farmName,
        farmAddress: land.farmAddress,
        areaInAcres: land.areaInAcres.toNumber(),
        soilType: land.soilType,
        farmer: land.farmer,
        dataHash: land.dataHash,
        timestamp: new Date(land.timestamp.toNumber() * 1000),
        coordinates: location.coordinates,
      },
    };
  } catch (error) {
    console.error("Error fetching land from blockchain:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get all lands for a farmer from blockchain
 * @param {string} farmerAddress - Farmer's Ethereum address
 * @returns {Promise<Array>} Array of land IDs
 */
async function getFarmerLandsFromBlockchain(farmerAddress) {
  try {
    const landIds = await landContract.getFarmerLands(farmerAddress);
    return {
      success: true,
      landIds: landIds.map(id => id.toNumber()),
      count: landIds.length,
    };
  } catch (error) {
    console.error("Error fetching farmer lands from blockchain:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  generateLandDataHash,
  formatCoordinatesToString,
  registerLandOnBlockchain,
  updateLandHashOnBlockchain,
  getLandFromBlockchain,
  getFarmerLandsFromBlockchain,
};
