const { ethers } = require("ethers");
const CropRegistry = require("./CropRegistry.json");

// Ganache RPC
const provider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:7545"
);

// Private key from Ganache (FIRST ACCOUNT)
const privateKey = "0x502880edce194972a986fcce18464211e601826fe225b799f4e7be5e4b09d6d3";

// Signer (wallet)
const wallet = new ethers.Wallet(privateKey, provider);

// Contract instance
const contractAddress = "0xb934a44290159119BB25015E5EbeE7Fc5135Ccfd";

const contract = new ethers.Contract(
  contractAddress,
  CropRegistry.abi,
  wallet
);

module.exports = contract;
