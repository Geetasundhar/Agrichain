const { ethers } = require("ethers");

// Note: You'll need to deploy LandRegistry.sol first and add the ABI
// For now, we'll use a generic ABI that can be updated once the contract is deployed

const LandRegistry_ABI = [
  "function registerLand(string memory _farmName, string memory _farmAddress, uint256 _areaInAcres, string memory _soilType, bytes32 _dataHash, string memory _coordinates) public returns (uint256)",
  "function updateLandHash(uint256 _landId, bytes32 _newDataHash) public",
  "function getLand(uint256 _id) public view returns (tuple(uint256 landId, string farmName, string farmAddress, uint256 areaInAcres, string soilType, address farmer, bytes32 dataHash, uint256 timestamp))",
  "function getLandLocation(uint256 _id) public view returns (tuple(uint256 landId, string coordinates))",
  "function getFarmerLands(address _farmer) public view returns (uint256[])",
  "function getFarmerLandCount(address _farmer) public view returns (uint256)",
  "function landCount() public view returns (uint256)"
];

// Ganache RPC
const provider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:7545"
);

// Private key from Ganache (FIRST ACCOUNT)
const privateKey = "0xf7476399765920aec0c400989b7f1a3edc94b7c312b38bd2055a92ac8c255ce4";

// Signer (wallet)
const wallet = new ethers.Wallet(privateKey, provider);

// CONTRACT ADDRESS - UPDATE AFTER DEPLOYMENT
// This is a placeholder, replace with the actual deployed contract address
const contractAddress = "0xD11336805d9C85be2c60B0C28e083D28fDA17BBB"; // Replace after deployment

const landContract = new ethers.Contract(
  contractAddress,
  LandRegistry_ABI,
  wallet
);

module.exports = landContract;
