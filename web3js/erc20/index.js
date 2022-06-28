const Web3 = require('web3');
const fs = require('fs');
const contractFile = require('./compile');

require('dotenv').config();
const privatekey = process.env.PRIVATE_KEY;
/*
   -- Define Provider & Variables --
*/

const receiver = '0x42e77900ee1cF000a4e62106b490e40FD5330504';

// Provider
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://kovan.infura.io/v3/' + process.env.INFURA_ID
  )
);

//account
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
  privateKey: account.privateKey,
  accountaddress: account.address,
};

// sol ---> abi + bin
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

/*
   -- Deploy Contract --
*/
const deploy = async () => {
  console.log(
    `Attempting to deploy from account ${account_from.accountaddress}`
  );
  web3.eth.getBlockNumber(function (error, result) {
    console.log(result);
  });
  // Create deploy Contract Instance
  const deployContract = new web3.eth.Contract(abi);

  // Create Constructor Tx, init supply
  const deployTx = deployContract.deploy({
    data: bytecode,
    arguments: ['Web3 Test', 'W3T', 0, 100000000],
  });

  // Sign Transacation and Send
  const deployTransaction = await web3.eth.accounts.signTransaction(
    {
      data: deployTx.encodeABI(),
      gas: '8000000',
    },
    account_from.privateKey
  );

  // Send Tx and Wait for Receipt
  const deployReceipt = await web3.eth.sendSignedTransaction(
    deployTransaction.rawTransaction
  );
  console.log(`Contract deployed at address: ${deployReceipt.contractAddress}`);
};


const transfer = async () => {
    const contractAddress = "0x387c9b214C27B145680A84060dA827B6827a7287";
    const erc20Contract = new web3.eth.Contract(
        abi,
        contractAddress
      );
    
      //build the Tx
      const transferTx = erc20Contract.methods
        .transfer(receiver, 100000)
        .encodeABI();
    
      // Sign Tx with PK
      const transferTransaction = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data: transferTx,
          gas: 8000000,
        },
        account_from.privateKey
      );
    
      // Send Tx and Wait for Receipt
      await web3.eth.sendSignedTransaction(
        transferTransaction.rawTransaction
      );
    
      await erc20Contract.methods
        .balanceOf(receiver)
        .call()
        .then((result) => {
          console.log(`The balance of receiver is ${result}`);
        });
}


const main = async () => {
    // await deploy();
    await transfer();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });