var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProofOfContentExistence = artifacts.require("./ProofOfContentExistence.sol");

module.exports = function(deployer) {
    deployer.deploy(SimpleStorage);
    deployer.deploy(ProofOfContentExistence);
};
