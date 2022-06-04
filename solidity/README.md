# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

# 在 hardhat 网络上部署合约

## 编译合约

```
npx hardhat compile
```

## 启动 hardhat 网络节点

```
npx hardhat node
```

## 部署脚本

```
  // We get the contract to deploy
  const ZombieOwnership = await hre.ethers.getContractFactory("ZombieOwnership");
  const zombieOwnership = await ZombieOwnership.deploy();

  await zombieOwnership.deployed();

  console.log("zombieOwnership deployed to:", zombieOwnership.address);
```

运行脚本

```shell
npx hardhat run ./scripts/sample-script.js --network localhost

```
