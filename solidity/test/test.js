const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZombieFeeding", function () {
  let zombie, owner;
  
  let init = async () => {
    const ZombieFeeding = await ethers.getContractFactory("ZombieOwnership");
    zombie = await ZombieFeeding.deploy();
    await zombie.deployed();
    console.log("deploy to:", zombie.address)
    return zombie;
  };
  
  before(async function () {
    zombie = await init();
    [owner] = await ethers.getSigners();
    return zombie;
  });


  it("createRandomZombie", async function () {
    await zombie.createRandomZombie("test")
    console.log("owner:", owner.address)
    let result = await zombie.balanceOf(owner.address);
    console.log("balanceOf = ", result)
    expect(result).equal(1);
  });

  it("get Zombie", async function () {
    // let zombie = await init();
    const [owner] = await ethers.getSigners();
    await zombie.createRandomZombie("test1")
    let result = await zombie.zombies(1);
    expect(result.name).equal("test1");
  });
});



