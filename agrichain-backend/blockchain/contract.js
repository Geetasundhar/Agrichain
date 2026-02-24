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
const contractAddress = "0xd772c9ce1714072Acd99cbf6B9c66e22B3617bde";

const contract = new ethers.Contract(
  contractAddress,
  CropRegistry.abi,
  wallet
);

module.exports = contract;
