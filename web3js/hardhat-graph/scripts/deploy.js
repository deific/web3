// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 获取签名者信息，可在hardhat.config.js中配置，hardhat默认内置10个account
  // 0x42e77900ee1cF000a4e62106b490e40FD5330504
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // 检查是否有足够的余额支付手续费
  const balance = await deployer.getBalance();
  console.log('Account balance:', (balance).toString());

  // 部署和合约，hardhat负责了编译和与节点的交互，不需要再自己进行编译
  const Token = await hre.ethers.getContractFactory("SimpleToken");
  const token = await Token.deploy('Graph Test', 'GT', 1, 100000000, {gasLimit: 4000000});
  await token.deployed();
  console.log("Greeter deployed to:", token.address);

  // 执行一笔转账测试合约
  const receiver = '0x42e77900ee1cF000a4e62106b490e40FD5330504';
  console.log('Transfer 50 to receiver ', receiver);
  let transferReceipt = await token.transfer(receiver, 50);
  await transferReceipt.wait();

  // 检查转账是否成功
  const receiverBalance = await token.balanceOf(receiver);
  console.log('Account balance of receiver is: ', (receiverBalance).toString());

  // 授权地址可转出额度
  let approveRecipt = await token.approve(receiver, 100000);
  await approveRecipt.wait();
  console.log(`allowance of ${deployer.address} to ${receiver} is `, (await token.allowance(deployer.address, receiver)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
