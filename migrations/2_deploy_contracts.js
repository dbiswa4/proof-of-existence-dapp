var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProofOfContentExistence = artifacts.require("./ProofOfContentExistence.sol");
var Owned = artifacts.require("./Owned.sol");
var Mortal = artifacts.require("./Mortal.sol");
var NameRegistry = artifacts.require("./NameRegistry.sol");
var ProofOfExistenceStorage = artifacts.require("./ProofOfExistenceStorage.sol");
var ProofOfExistence = artifacts.require("./ProofOfExistence.sol");


module.exports = function(deployer) {
    deployer.deploy(SimpleStorage);
    deployer.deploy(Owned);
    deployer.deploy(Mortal);
    deployer.deploy(ProofOfContentExistence);
    
    deployer.deploy(ProofOfExistenceStorage);
    deployer.deploy(ProofOfExistence);
    //Should be at the end as it need the deployed addresses of ProofOfExistenceStorage and ProofOfExistence
    deployer.deploy(NameRegistry,"ProofOfExistenceStorage", ProofOfExistenceStorage.address, "ProofOfExistence", ProofOfExistence.address);
    
    
};
