require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
        url: process.env.ALCHEMY_API_KEY, // .env 文件中定义的环境变量，node环境会自动识别和赋值
        accounts: [process.env.RINKEBY_PRIVATE_KEY], // .env 文件中定义的环境变量，node环境会自动识别和赋值
    },
  }
};
