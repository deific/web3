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

const contractAddress = "0xaD3432C5caD510fA10617a44f0CE58c51B545D0D";
var myContract = new web3.eth.Contract(abi, contractAddress, {
    from: account_from.accountAddress, // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});

const getNumber = async () => {
    // call the contract
    let result = await myContract.methods.number().call();
    console.log("get number result: " + result);
}

const increase = async () => {
    // call the contract
    let incrementTx = myContract.methods.increment(10).send({
        from: account_from.accountAddress
    }).then(function(receipt){
        console.log("receipt:", receipt);
    });
}

const increase2 = async () => {
    // call the contract
    let incrementTx = {
        from: account_from.accountAddress,
        to: contractAddress,
        gas: 800000,
        gasPrice: 20000000000,
        data: myContract.methods.increment(10).encodeABI()
    };

    console.log("incrementTx:", incrementTx);
    // Sign tx
    const incrementTransaction = await web3.eth.accounts.signTransaction(
        incrementTx, 
        account_from.privateKey
    );
    const result = await web3.eth.sendSignedTransaction(incrementTransaction.rawTransaction);
    console.log("increment number result: " + JSON.stringify(result));
}

const test = async () => {
    await getNumber();
    await increase2();
    await getNumber();
}

test().then(result => {
    console.log("test result: " + JSON.stringify(result));
})
