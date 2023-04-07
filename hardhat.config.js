require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {},
    // goerli: {
    //   url: process.env.GOERLI_URL,
    //   accounts: [process.env.PRIVATE_KEY],
    //   gas: 30000000,
    //   gasPrice: 8000000000, 
    // },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY],
      gas: 30000000,
      gasPrice: 50000000000
    }
  },
  etherscan: {
    apiKey: {
      // goerli: process.env.goerli,
      polygonMumbai: process.env.polygonMumbai
    },
  },
};
