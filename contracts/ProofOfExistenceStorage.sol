pragma solidity ^0.4.18;

import "./Mortal.sol";

contract ProofOfExistenceStorage is Mortal{

    //Document idenfiers alongwith ipfs has of the document
    struct Document {
        bytes32 docHash;
        uint docTimestamp;
        string ipfsHash;
    }

    //To keep track of all the documents owned by a user
    struct User {
        address addr;
        string userName;
        bytes32[] documentList;
        mapping(bytes32 => Document) documentDetails;
        //uint lastUploadTimestamp;
    }

    //Maintain user usage count to implement throtlling
    struct UserUsageCount {
        uint uploadTime;
        uint count;
    }

    //Storage variables
    mapping(address => bool) public admins;

    function getAdmins(address _address) public returns() {
        
    }

    mapping( string => Document) public documents;
    mapping(address => UserUsageCount) public usersUsage;
    bool public stopped = false;
    //Used as map key
    mapping (address => User) public users;


}