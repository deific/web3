let Web3 = require('web3');
let solc = require('solc');
let fs = require('fs');

// Get privatekey from environment
require('dotenv').config();
const privatekey = process.env.PRIVATE_KEY;

// Load contract
const source = fs.readFileSync('Incrementer.sol', 'utf8');

// compile solidity
const input = {
    language: 'Solidity',
    sources: {
      'Incrementer.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("compiled contractFile :" + JSON.stringify(tempFile));
const contractFile = tempFile.contracts['Incrementer.sol']['Incrementer'];
console.log(`compiled contractFile : ${tempFile}`);

// Get bin & abi
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// Create web3 with kovan provider，you can change kovan to other testnet
const web3 = new Web3('https://kovan.infura.io/v3/' + process.env.INFURA_ID);

// Create account from privatekey
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
  privateKey: privatekey,
  accountAddress: account.address,
};
console.log(`use account : ${account_from.accountAddress}`);

/**
 * Deploy constract
 */
const Deploy = async () => {
    // Create contract instance
    const deployContract = new web3.eth.Contract(abi);

    // Create tx
    const deployTx = deployContract.deploy({
        data: bytecode,
        arguments: [100], // 部署合约的初始化参数
    });
    
    // Sign tx
    const deployTransaction = await web3.eth.accounts.signTransaction(
        {
            // from: account_from.accountAddress,
            data: deployTx.encodeABI(),
            gas: 8000000,
        }, 
        account_from.privateKey
    );

    const deployReceipt = await web3.eth.sendSignedTransaction(deployTransaction.rawTransaction);
    // Your deployed contrac can be viewed at: https://kovan.etherscan.io/address/${deployReceipt.contractAddress}
    // You can change kovan in above url to your selected testnet.
    console.log(`Contract deployed at address: ${deployReceipt.contractAddress}`);
};

// 执行部署合约
Deploy()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
})