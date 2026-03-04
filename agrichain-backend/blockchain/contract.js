const { ethers } = require("ethers");
const CropRegistry = require("./CropRegistry.json");

// Ganache RPC
const provider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:7545"
);

// Private key from Ganache (FIRST ACCOUNT)
const privateKey = "0xf7476399765920aec0c400989b7f1a3edc94b7c312b38bd2055a92ac8c255ce4";

// Signer (wallet)
const wallet = new ethers.Wallet(privateKey, provider);

// Contract instance
const contractAddress = "0xD11336805d9C85be2c60B0C28e083D28fDA17BBB";

const contract = new ethers.Contract(
  contractAddress,
  CropRegistry.abi,
  wallet
);

module.exports = contract;
