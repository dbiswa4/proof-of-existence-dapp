pragma solidity ^0.4.18;

/**
 * Creates a registry for contracts
 **/
contract NameRegistry {


    // Manages the name to address mapping
    mapping(bytes32 => address)  contractLookup;

    //Constructor
    constructor(string _storageContractName, address _storageContractAddr, 
                        string _behaviourContractName, address _behaviourContractAddr) public {
        bytes32 storageContractNameHash = keccak256(_storageContractName);
        bytes32 behaviourContractNameHash = keccak256(_behaviourContractName);

        contractLookup[storageContractNameHash] = _storageContractAddr;
        contractLookup[behaviourContractNameHash] = _behaviourContractAddr;
        
    }

    // Adds the version of the contract to be used by apps
    function  registerName (bytes32 name, address conAddress) public returns(bool){
        contractLookup[name] = conAddress;
        return true;
    }

    // Contracts having a dependency on this contract will invoke this function
    function  getContractInfo(bytes32 name) public constant returns(address){
        return (contractLookup[name]);
    }

    function  removeContract(bytes32 name) public view returns(bool){
        delete contractLookup[name];
        return false;
    }

}