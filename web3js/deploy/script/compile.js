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

module.exports = contractFile;