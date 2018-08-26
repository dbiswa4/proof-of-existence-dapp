var Owned = artifacts.require("./Owned.sol");
var Mortal = artifacts.require("./Mortal.sol");
var ProofOfExistence = artifacts.require("./ProofOfExistence.sol");
var Utils = artifacts.require("./Utils.sol");

module.exports = function(deployer) {
    deployer.deploy(Owned);
    deployer.deploy(Mortal);
    deployer.deploy(Utils);
    deployer.link(Utils, ProofOfExistence);
    deployer.deploy(ProofOfExistence);
};
