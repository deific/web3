const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZombieFeeding", function () {
  let zombie;
  before(async function(done) {
    const ZombieFeeding = await ethers.getContractFactory("ZombieOwnership");
    zombie = await ZombieFeeding.deploy();
    await zombie.deployed();
    console.log("deploy to:", zombie.address)
    return zombie;
  });
  
  // it("init", async function () {
  //   const ZombieFeeding = await ethers.getContractFactory("ZombieOwnership");
  //   const zombie = await ZombieFeeding.deploy();
  //   await zombie.deployed();
  //   console.log("deploy to:", zombie.address)
  // })

  it("createRandomZombie", async function () {
    const account = await hre.ethers.getSigners()[0];
    await zombie.createRandomZombie("test")
    let result = await zombie.balanceOf(account);
    console.log("balanceOf = ", result)
    expect(result).toEqual(1);
  });


  it("get Zombie", async function () {
    const account = await hre.ethers.getSigners()[0];
    let result = await zombie.zombies(0);
    console.log("balanceOf = ", result)
    expect(result.name).toEqual("test");
  });
});



