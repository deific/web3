var { IncrementerContract, web3, web3Socket, account_from}  = require("./deploy");

// // Get privatekey from environment
// require('dotenv').config();
// const privatekey = process.env.PRIVATE_KEY;
const myContract = IncrementerContract.myContract;
const wssContract = new web3Socket.eth.Contract(IncrementerContract.abi, IncrementerContract.contractAddress);

const getNumber = async () => {
    // call the contract
    let result = await myContract.methods.number().call();
    console.log("get number result: " + result);
}

const increase = async (_value) => {
    // call the contract
    let incrementTx = myContract.methods.increment(_value);
    // sign tx
    let incrementSignedTx = await web3.eth.accounts.signTransaction(
      {
        to: IncrementerContract.contractAddress,
        data: incrementTx.encodeABI(),
        gas:800000
      },
      account_from.privateKey
    );

    let incrementReceipt = await web3.eth.sendSignedTransaction(incrementSignedTx.rawTransaction);
    console.log("increment number result: " + JSON.stringify(incrementReceipt));
}

const increase2 = async (_value) => {
    // call the contract
    let incrementTx = {
        from: account_from.accountAddress,
        to: IncrementerContract.contractAddress,
        gas: 800000,
        gasPrice: 20000000000,
        data: myContract.methods.increment(_value).encodeABI()
    };

    // Sign tx
    const incrementTransaction = await web3.eth.accounts.signTransaction(
        incrementTx, 
        account_from.privateKey
    );
    const result = await web3.eth.sendSignedTransaction(incrementTransaction.rawTransaction);
    console.log("increment number transactionHash: ", result.transactionHash);
}

const listener = () => {
  console.log("start listener myContract:", IncrementerContract.contractAddress);
  wssContract.once("Increment", (error, event) => {
    console.log("once event", event);
  });
  
  wssContract.events.Increment((error, event) => {
    console.log("listen everytime event", event)
  });
}

const getPastEvent = async () => {
  const pastEvent = await wssContract.getPastEvents("Increment",  {
    fromBlock: IncrementerContract.blockNumber,
    toBlock: 'latest',
  });
  
  pastEvent.map((event, i) => {
    console.log("past event" + i, event);
  })
}

function sleep(ms) {
  return new Promise(resolve=>setTimeout(resolve, ms))
}

console.log("************************************");
listener();
const test = async () => {
    console.log("************************************");
    await getNumber();
    console.log("************************************");
    await increase2(10);
    console.log("************************************");
    await getNumber();
    console.log("************************************");
    sleep(10000);
    await getPastEvent();
    console.log("************************************");
}



test().then(result => {
    console.log("test compiled ");
})
