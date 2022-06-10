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
    let result = await zombie.balanceOf(owner.address);
    expect(result).equal(1);
  });


  it("get Zombie", async function () {
    const [owner] = await ethers.getSigners();
    await zombie.createRandomZombie("test1")
    let result = await zombie.zombies(1);
    expect(result.name).equal("test1");
  });

  it("ownerOf", async function () {
    const [owner] = await ethers.getSigners();
    let ownerAddress = await zombie.ownerOf(1)
    expect(ownerAddress).equal(owner.address);
  });

  it("transfer Zombie", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await zombie.transfer(addr1.address, 0)
    let ownerAddress = await zombie.ownerOf(0)
    expect(ownerAddress).equal(addr1.address);
  });

  it("approve Zombie", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await zombie.approve(addr1.address, 1)
    let ownerAddress = await zombie.ownerOf(1)
    expect(ownerAddress).equal(owner.address);
  });

  it("takeOwnership Zombie", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await zombie.approve(addr1.address, 1)
    zombie = await zombie.connect(addr1);
    await zombie.takeOwnership(1)
    let ownerAddress = await zombie.ownerOf(1)
    expect(ownerAddress).equal(addr1.address);
  });

  it("levelUp Zombie", async function () {
    const [owner, addr1] = await ethers.getSigners();
    zombie = await zombie.connect(addr1);
    let result = await zombie.zombies(1);
    await zombie.levelUp(1, {value: ethers.utils.parseEther('0.001')});
    let result2 = await zombie.zombies(1);
    expect(result.level + 1).equal(result2.level);
  });

  it("changeName Zombie", async function () {
    const [owner, addr1] = await ethers.getSigners();
    zombie = await zombie.connect(addr1);
    let result = await zombie.zombies(1);
    await zombie.changeName(1, "hello");
    let result2 = await zombie.zombies(1);
    expect(result.name).not.equal(result2.name);
    expect("hello").equal(result2.name);
  });

  it("withdraw", async function () {
    const [owner, addr1] = await ethers.getSigners();
    zombie = await zombie.connect(addr1);
    let result = await zombie.withdraw(1);
    await zombie.levelUp(1, {value: ethers.utils.parseEther('0.001')});
    let result2 = await zombie.zombies(1);
    expect(result.level + 1).equal(result2.level);
  });
});



