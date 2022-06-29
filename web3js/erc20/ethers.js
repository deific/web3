const {ethers} = require('ethers');
const fs = require('fs');
const contractFile = require('./compile')

require('dotenv').config();
const privatekey = process.env.PRIVATE_KEY;

/**
 * Define Provider & Variables
 */
const Provider = {
    development: {
        name: 'moonbeam-development',
        rpc: 'http://localhost:8545',
        chainId: 1281,
    },
    moonbase: {
      name: 'moonbase-alpha',
      rpc: 'https://rpc.testnet.moonbeam.network',
      chainId: 1287,
    },
}

const provider = new ethers.providers.InfuraProvider('kovan', process.env.INFURA_ID);
const account_from = {
    privateKey: privatekey,
}

const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// create Wallet, 利用钱包进行签名
let wallet = new ethers.Wallet(account_from.privateKey, provider);
const receiverAddress = "0x42e77900ee1cF000a4e62106b490e40FD5330504";
/**
 * 部署合约
 */
const deploy = async () => {
    const myContractTemplate = new ethers.ContractFactory(abi, bytecode, wallet);
    console.log('===============================1. Deploy Contract');
    console.log(`Attempting to deploy from account: ${wallet.address}`);

    // Send tx and wait for Receipt
    const myContract = await myContractTemplate.deploy(
        'Ethers Test', 'ETT', 1, 100000000, {gasLimit: 4000000}
        );

    console.log(`Contract deployed at address: ${myContract.address}`);
    
    // 转账
    const transferReceipt = await myContract.transfer(receiverAddress, 100000);
    await transferReceipt.wait();
    console.log(`Tx successful with hash: ${transferReceipt.hash}`);
}

/**
 * 链接合约并调用方法
 */
 const call = async () => {
    const contractAddress = "0x906571bcE4281F7bC95F3f52bCe9bA2e1F8B129b";
    console.log('===============================2. Connect Contract');
    console.log(`Connecting to contract: ${contractAddress}`);

    // Send tx and wait for Receipt,使用钱包做作为signer参数，具有签名权利
    const myContract = new ethers.Contract(contractAddress, abi, wallet);

    // 查询余额
    const balance = await myContract.balanceOf(receiverAddress);
    console.log(`balance of ${receiverAddress} is: ${balance}`);
}

/**
 * 监听事件
 */
 const listen = async () => {
    const contractAddress = "0x8eFc85D1708C67F454EBB4CF017A309FB1b46138";
    console.log('===============================3. Connect Contract');
    console.log(`Connecting to contract: ${contractAddress}`);

    // Send tx and wait for Receipt,使用provider做作为signer参数，只有读取权限
    const myContract = new ethers.Contract(contractAddress, abi, provider);
    const transactionContract = new ethers.Contract(contractAddress, abi, wallet);

    myContract.once('Transfer', (from, to, value) => {
        console.log(
            `I am a once Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
          );
    })

    myContract.on('Transfer', (from, to, value) => {
        console.log(
          `I am a longstanding Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
        );
    });

      // Listen to events with filter
    let topic = ethers.utils.id('Transfer(address,address,uint256)');
    let filter = {
        address: deployedContract.address,
        topics: [topic],
        fromBlock: await provider.getBlockNumber(),
    };

    myContract.on(filter, (from, to, value) => {
        console.log(
          `I am a filter Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
        );
    });

    for (let step = 0; step < 3; step++) {
        let transferTransaction = await transactionContract.transfer(
            receiverAddress,
          10
        );
        await transferTransaction.wait();
    
        if (step == 2) {
          console.log('Going to remove all Listeners');
          myContract.removeAllListeners();
        }
      }
}

const main = async () => {
    await deploy();
    // await transfer();
}

main()
  .then(() => process.exit(0))ß
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });