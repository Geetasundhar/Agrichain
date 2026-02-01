const { ethers } = require("hardhat");

async function main() {
  const CropRegistry = await ethers.getContractFactory("CropRegistry");
  const contract = await CropRegistry.deploy();

  await contract.deployed();

  console.log("CropRegistry deployed to:", contract.address);
}

main().catch(console.error);
