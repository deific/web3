const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  // 顯示部署者帳號
  console.log("Deploying contract with account:", deployer.address);
  // 顯示部署者餘額
  console.log("Deployer accout balance:", (await deployer.getBalance()).toString());
  
  // 部署
  const FlashLoan = await ethers.getContractFactory("FlashloanV1");
  const flashLoan = await FlashLoan.deploy("0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5");
  await flashLoan.deployed();

  console.log("SofiaCoin token deployed to:", flashLoan.address);
  console.log("Deployer accout balance:", (await deployer.getBalance()).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });