// scripts/deployLandRegistry.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying LandRegistry contract...");

  try {
    // Get the contract factory
    const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
    
    // Deploy the contract
    const landRegistry = await LandRegistry.deploy();
    
    // Wait for deployment to finish
    await landRegistry.deployed();
    
    console.log("✅ LandRegistry deployed successfully!");
    console.log("📍 Contract Address:", landRegistry.address);
    
    // Save deployment info
    const deploymentInfo = {
      contractName: "LandRegistry",
      address: landRegistry.address,
      network: hre.network.name,
      deployedAt: new Date().toISOString(),
      deployer: (await hre.ethers.getSigners())[0].address
    };
    
    console.log("\n📋 Deployment Info:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n⚠️  IMPORTANT: Update these values in landContract.js:");
    console.log(`const contractAddress = "${landRegistry.address}";`);
    
    // Verify contract if on a public network
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      console.log("\n⏳ Waiting 30 seconds before verification...");
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      try {
        console.log("🔍 Verifying contract on block explorer...");
        await hre.run("verify:verify", {
          address: landRegistry.address,
          constructorArguments: [],
        });
        console.log("✅ Contract verified!");
      } catch (error) {
        console.log("⚠️  Verification failed (might already be verified):", error.message);
      }
    }
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
