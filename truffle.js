var HDWalletProvider = require("truffle-hdwallet-provider");
 
//Please update mnemonic to be able to connect to Ropsten network.
var mnemonic = "tortoise runs past... ";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
  ropsten: {
    provider: function() {
      return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/");
    },
    network_id: '3',
    gas:4500000
  },
  rinkeby: {
    provider: function() {
      return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/");
    },
    network_id: '4',
    gas:4500000
  }
}
};
