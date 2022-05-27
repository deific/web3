const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZombieFeeding", function () {
  it("test", async function () {
    const ZombieFeeding = await ethers.getContractFactory("ZombieFeeding");
    const zombie = await ZombieFeeding.deploy();
    await zombie.deployed();

    await zombie.feedOnKitty(1, 1)
 
  });
});
