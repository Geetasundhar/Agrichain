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
const privateKey = "0x502880edce194972a986fcce18464211e601826fe225b799f4e7be5e4b09d6d3";

// Signer (wallet)
const wallet = new ethers.Wallet(privateKey, provider);

// CONTRACT ADDRESS - UPDATE AFTER DEPLOYMENT
// This is a placeholder, replace with the actual deployed contract address
const contractAddress = "0xb934a44290159119BB25015E5EbeE7Fc5135Ccfd"; // Replace after deployment

const landContract = new ethers.Contract(
  contractAddress,
  LandRegistry_ABI,
  wallet
);

module.exports = landContract;
