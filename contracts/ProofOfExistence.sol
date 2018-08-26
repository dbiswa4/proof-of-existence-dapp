pragma solidity ^0.4.18;

import "./Mortal.sol";
import "./Utils.sol";

contract ProofOfExistence is Mortal{

    mapping(address => UserUsageCount) usersUsage;
    uint documentUploadPeriod = 120 seconds;
    uint documentLimit = 3;
    //A limit is enforced so that the contract does not get swampped with big strings
    uint private constant docTagsMaxLen = 82;
    bool private stopped = false;
    mapping(address => bool) admins;
    
    /*
    Document upload actions. To be used for user throtling.
    This is safeguard agisnt malicious intent of keeping the contract busy
    */
    enum UploadChoices { UPLOAD_CNT_INCR, UPLOAD_CNT_RESET, UPLOAD_NO }
    UploadChoices uploadChoice;
    UploadChoices constant defaultUploadChoice = UploadChoices.UPLOAD_NO;

    /*
    Document idenfiers alongwith ipfs has of the document. Document hash, 
    document tags, upload timestamp and IPFS hash stored as document property 
    in Blockchain
    */
    struct Document {
        bytes32 docHash;
        string docTags;
        uint docTimestamp;
        string ipfsHash;
    }

    /*
    To keep track of all the documents owned by a user. For each address, it stores a list of 
    documents hash, and another map containing structure where the document details 
    are held.
    */
    struct User {
        address addr;
        bytes32[] documentList;
        mapping(bytes32 => Document) documentDetails;
    }

    //To identify user by an Ethereum address
    mapping (address => User) users;

    //Maintain user usage count to implement throtlling
    struct UserUsageCount {
        uint uploadTime;
        uint count;
    }


    //Events for logging
    event LogDocumentRequest(address _addr,string _docTags, bytes32 _dochash, uint _docTimestamp, string _ipfsHash, string _notes);
    event LogAssignAdmin(address _sender, string _message);
    event LogFallback(address _sender,uint _value);

    //Modifiers
    //To restrict only to owner
    modifier onlyOwner(){require(msg.sender == owner, "msg sender is not Owner"); _;}
    //To restrict only to allocated admins by owner of the contract
    modifier onlyAdmin(){require(admins[msg.sender] == true,"Sender is not Admin"); _;}
    //To pause the contract in Emergency
    modifier stopInEmergency {if (!stopped) _;}
    modifier onlyInEmergency {if (stopped) _;}

    //Circuit Breaker to pause the contract in case of Emergency
    function toggleContractActive() public 
    onlyOwner {
        stopped = !stopped;
    }

    //Make use of the library function and get the length of the document 
    //string passed from fronstend
    function isStringAcceptable(string _str) 
    public
    pure
    returns(bool) {
        if (Utils.utfStringLength(_str) <= docTagsMaxLen) {
            return true;
        }
        return false;
    }

    /*
    Upload document hash to Blockchain. It does couple of checks before registering 
    the document details to blockchain.
    - The doc tags should be of acceptable length
    - Rate Limiting - Check whether user is in aprroved limit of uploads in a certain duration
    - Check whether document already exists in blockchain
    - Finally update on chain data
    */
    function uploadDocument(bytes32 _docHash,string _docTags,string _ipfsHash) 
    public
    stopInEmergency 
    returns(bool) {
        //Verify the string field (docTags) passed.
        //This is a safeguard to stop someone storing huge ammount of data into Blockchain
        if(!isStringAcceptable(_docTags)) {
            return false;
        }

        //UserUsageCount storage userUploadStats = usersUsage[msg.sender];
        UploadChoices choice = verifyRateLimit(msg.sender);

        if (choice == UploadChoices.UPLOAD_CNT_RESET) {
            updateOnChainData(_docHash,_docTags,_ipfsHash);
            usersUsage[msg.sender].uploadTime = now;
            usersUsage[msg.sender].count = 1;
            //Log document upload event
            emit LogDocumentRequest(msg.sender, _docTags,_docHash, block.timestamp, _ipfsHash, "Upload Success - Throtling count reset");

        } else if (choice == UploadChoices.UPLOAD_CNT_INCR) {
            updateOnChainData(_docHash,_docTags,_ipfsHash);
            usersUsage[msg.sender].count += 1;
            //Log document upload event
            emit LogDocumentRequest(msg.sender, _docTags,_docHash, block.timestamp, _ipfsHash, "Upload Success");

        } else if (choice == UploadChoices.UPLOAD_NO){
            emit LogDocumentRequest(msg.sender, _docTags,_docHash, block.timestamp, _ipfsHash, "Upload Not Success - throtling limit exceeded");
        } else {
            return false;
        }
        return true;
    }

    /*Private function which actually update on chain data. Separate function only to modulaarize 
    internal functionality
    */
    function updateOnChainData(bytes32 _docHash,string _docTags,string _ipfsHash) 
    private
    returns(bool) {
        /*
        check whether the document already exists in the blockchain
        if the document does not exist then add the document details and return true
        if the document already exists then do nothing and return false
        */
        if(users[msg.sender].documentDetails[_docHash].docHash == 0){
            users[msg.sender].addr = msg.sender;
            users[msg.sender].documentList.push(_docHash);
            users[msg.sender].documentDetails[_docHash] = Document(_docHash, _docTags, block.timestamp, _ipfsHash);
        }else {
            return false;
        }
        return true;
    }

    
    /*
    Throtling function
    Verify whether user exceeded rate limit assigned
    */
    function verifyRateLimit(address _addr)
    private
    view
    returns(UploadChoices) {
        UserUsageCount storage _userUploadStats = usersUsage[_addr];
        if(block.timestamp >= _userUploadStats.uploadTime + documentUploadPeriod){
            return UploadChoices.UPLOAD_CNT_RESET;
        } else {
            if(_userUploadStats.count >= documentLimit){
                return UploadChoices.UPLOAD_NO;
            }else{
                return UploadChoices.UPLOAD_CNT_INCR;
            }
        }
        return defaultUploadChoice;
    }

    /*
    Fetch document details by the doc hash
    Given a doc, Hash is calculated by the frontend and passed to the contract.
    Using the doc hash, corresponding details are then fetched from Blockchain
    */
    function fetchDocument(bytes32 _docHash) 
    public 
    returns(bytes32, string, uint, string){
        require(_docHash != 0, "Document Hash is mandatory");
        Document storage document = users[msg.sender].documentDetails[_docHash];
        emit LogDocumentRequest(msg.sender,document.docTags,document.docHash, document.docTimestamp,document.ipfsHash, "Doc Fetch Req");
        return(document.docHash, document.docTags, document.docTimestamp, document.ipfsHash);
    }

    //Fetch all the documents for a given user
    function fetchAllDocuments() public 
    view 
    returns(bytes32[]){
        return users[msg.sender].documentList;
    }

    /*
    Allows the owner to withdraw funds sent to the contract account when required
    Contract needs to be paused before owner can withdrwa funds though
    */
    function withdrawFunds() public 
    onlyOwner 
    onlyInEmergency
    returns(bool){
        uint bal = address(this).balance;
        msg.sender.transfer(bal);
        return true;
    }
    
    //Returns current balance in the contract
    function checkBalance() 
    public 
    view
    returns(uint) {
        return address(this).balance;
    }

    //Assign admin access
    function assignAdminAccess(address _address) public
    onlyOwner
    returns(bool){
        if(admins[_address] == false){
            admins[_address] = true;
            emit LogAssignAdmin(_address,"Admin Role assigned");
            return true;
        } else {
            emit LogAssignAdmin(_address,"Either user does not exists or already has Admin access");
        }
        return false;
    }

    //Revoke admin access
    function revokeAdminAccess(address _address) public 
    onlyOwner 
    returns(bool){
        if(admins[_address] == true){
            delete admins[_address];
            emit LogAssignAdmin(_address,"Admin Revoked");
            return true;
        }else{
            emit LogAssignAdmin(_address,"Nothing to be removed. Account does not have Admin access");
            return false;
        }
    }

    //Verify whether a user is already admin
    function isAdmin(address _address) 
    public 
    view 
    returns(bool){
        if(admins[_address] == true){
            return true;
        }
        return false;
    }

    //Fallback function
    function () public payable {         
        //Secutiry measure to stop user to send any malicious content alongwith the transaction
        require(msg.data.length == 0,"oops!!! Data length should be zero");         
        emit LogFallback(msg.sender,msg.value);     
    }
}