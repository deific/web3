const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlashLoan", function () {
  it("FlashLoan", async function () {
    const FlashLoan = await ethers.getContractFactory("FlashloanV1");
    const flashLoan = await FlashLoan.deploy("0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5");
    await flashLoan.deployed();
    console.log("deploy to:", flashLoan.address)

    await flashLoan.flashloan("0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD", ethers.BigNumber.from("1000000000000000000000"));
  });
});
