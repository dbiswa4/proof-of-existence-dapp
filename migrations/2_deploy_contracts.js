var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProofOfContentExistence = artifacts.require("./ProofOfContentExistence.sol");
var Owned = artifacts.require("./Owned.sol");
var Mortal = artifacts.require("./Mortal.sol");
var ProofOfExistence = artifacts.require("./ProofOfExistence.sol");
var Utils = artifacts.require("./Utils.sol");

module.exports = function(deployer) {
    deployer.deploy(SimpleStorage);
    deployer.deploy(Owned);
    deployer.deploy(Mortal);
    deployer.deploy(ProofOfContentExistence);
    deployer.deploy(Utils);
    deployer.link(Utils, ProofOfExistence);
    deployer.deploy(ProofOfExistence);
};
