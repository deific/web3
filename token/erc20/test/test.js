const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SofiaCoin", function () {
  it("return name", async function () {
    const SofiaCoin = await ethers.getContractFactory("SofiaCoin");
    const sofia = await SofiaCoin.deploy();
    await sofia.deployed();

    expect(await sofia.name()).equal("Sofia Coin");
  });
});
