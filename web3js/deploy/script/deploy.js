const contractFile = require("./compile");
let Web3 = require('web3');

// Get privatekey from environment
require('dotenv').config();
const privatekey = process.env.PRIVATE_KEY;

// Create web3 with kovan provider，you can change kovan to other testnet
// Provider
const providerRPC = {
  development: 'https://kovan.infura.io/v3/' + process.env.INFURA_ID,
  Web3Socket: "wss://kovan.infura.io/ws/v3/e15e0000062640788a3eeff8fef940e0",
  moonbase: "https://rpc.testnet.moonbeam.network",
};

const web3 = new Web3(providerRPC.development);
const web3Socket = new Web3(
    new Web3.providers.WebsocketProvider(providerRPC.Web3Socket),
);

// Create account from privatekey
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
  privateKey: privatekey,
  accountAddress: account.address,
};
console.log(`use account : ${account_from.accountAddress}`);

// Get bin & abi
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

const IncrementerContract = () => {
    // 1: 0xaD3432C5caD510fA10617a44f0CE58c51B545D0D 
    // 2: 0xC0C8cBF1E7452a3A9A583E9D526f065ee289242f "blockNumber":32412924
    const contractAddress = "0xC0C8cBF1E7452a3A9A583E9D526f065ee289242f";
    const myContract = new web3.eth.Contract(abi, contractAddress, {
        from: account_from.accountAddress, // default from address
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });

    return { 
        myContract: myContract,
        contractAddress: contractAddress,
        abi: abi,
        blockNumber: 32412924
    }
}


const deploy = async (initVlaue) => {
    console.log("abi:", abi);
    // Create contract instance
  const deployContract = new web3.eth.Contract(abi);
  // Create Tx
  const deployTx = deployContract.deploy({
        data: bytecode,
        arguments: [initVlaue],
  });

  // Sign Tx
  const deployTransaction = await web3.eth.accounts.signTransaction(
    {
      data: deployTx.encodeABI(),
      gas: 8000000,
    },
    account_from.privateKey
  );
  const result = await web3.eth.sendSignedTransaction(deployTransaction.rawTransaction);
  console.log("deploy contract at: " + JSON.stringify(result));
}

// deploy(200);
module.exports = {IncrementerContract: IncrementerContract(), web3, web3Socket, account_from};
