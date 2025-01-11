  require("@nomiclabs/hardhat-waffle");
  require("dotenv").config();

  module.exports = {
    networks: {
      hardhat: {
        chainId: 1337
      },
      sepolia: {
        url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
        accounts: process.env.PRIVATE_KEY ? [`0x${process.env.e2e7385cb49c4a3d93d0a1c4278c54f6}`] : []
      }
    },
    solidity: "0.8.20"
  };