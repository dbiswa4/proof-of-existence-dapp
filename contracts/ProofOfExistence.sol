pragma solidity ^0.4.18;

import "./Mortal.sol";
import "./Utils.sol";

contract ProofOfExistence is Mortal{

    //Import all the functions from library contract
    //using Utils for *; 

    mapping(address => bool) admins;
    mapping( string => Document) documents;
    mapping(address => UserUsageCount) usersUsage;
    uint documentUploadPeriod = 120 seconds;
    uint documentLimit = 3;
    uint private constant docTagsMaxLen = 82;
    bool private stopped = false;
    
    //Document upload actions. To be used for user throtling
    enum UploadChoices { UPLOAD_CNT_INCR, UPLOAD_CNT_RESET, UPLOAD_NO }
    UploadChoices uploadChoice;
    UploadChoices constant defaultUploadChoice = UploadChoices.UPLOAD_NO;

    //Document idenfiers alongwith ipfs has of the document
    struct Document {
        bytes32 docHash;
        string docTags;
        uint docTimestamp;
        string ipfsHash;
    }

    //To keep track of all the documents owned by a user
    struct User {
        address addr;
        bytes32[] documentList;
        mapping(bytes32 => Document) documentDetails;
        //uint lastUploadTimestamp;
    }

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
    modifier onlyOwner(){require(msg.sender == owner, "msg sender is not owner"); _;}
    modifier onlyAdmin(){require(admins[msg.sender] == true,"Sender is not Admin"); _;}
    modifier stopInEmergency {if (!stopped) _;}
    modifier onlyInEmergency {if (stopped) _;}

    //Circuit Breaker to pause the contract in case of Emergency
    function toggleContractActive() public 
    onlyOwner {
        stopped = !stopped;
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

    function isStringAcceptable(string _str) 
    public
    pure
    returns(bool) {
        if (Utils.utfStringLength(_str) <= docTagsMaxLen) {
            return true;
        }
        return false;
    }

    //Upload document hash to Blockchain
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

    function updateOnChainData(bytes32 _docHash,string _docTags,string _ipfsHash) 
    private
    returns(bool) {
        //check whether the document already exists in the blockchain
        //if the document does not exist then add the document details and return true
        //if the document already exists then do nothing and return false

        //ToDo: Whether to move check for already existing case to throtling function?

        if(users[msg.sender].documentDetails[_docHash].docHash == 0){
            users[msg.sender].addr = msg.sender;
            users[msg.sender].documentList.push(_docHash);
            users[msg.sender].documentDetails[_docHash] = Document(_docHash, _docTags, block.timestamp, _ipfsHash);
            //users[msg.sender].lastUploadTimestamp = block.timestamp;
        }else {
            return false;
        }
        return true;
    }

    
    //verify whether user exceeded rate limit assigned
    /*
    TypeError: This type is only supportedin the new experimental ABI encoder. 
    Use "pragma experimental ABIEncoderV2;" to enable the feature.
    */
    //function verifyRateLimit(address _addr, UserUsageCount _userUploadStats)
    function verifyRateLimit(address _addr)
    private
    view
    returns(UploadChoices) {

        //Do not like the duplication here, but get a compilation error if I pass it to this function
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

    //Fetch documents
    function fetchDocument(bytes32 _docHash) 
    public 
    returns(bytes32, string, uint, string){
        require(_docHash != 0, "Document Hash is mandatory");
        
        Document storage document = users[msg.sender].documentDetails[_docHash];
        emit LogDocumentRequest(msg.sender,document.docTags,document.docHash, document.docTimestamp,document.ipfsHash, "Doc Fetch Req");
        return(document.docHash, document.docTags, document.docTimestamp, document.ipfsHash);
    }

    //To fetch all the documents for a user
    function fetchAllDocuments() public 
    view 
    returns(bytes32[]){
        return users[msg.sender].documentList;
    }

    //this method will let he owner withdraw funds sent to the contract account.
    function withdrawFunds() public 
    onlyOwner 
    onlyInEmergency
    returns(bool){
        uint bal = address(this).balance;
        msg.sender.transfer(bal);
        return true;
    }
    
    function checkBalance() 
    public 
    view
    returns(uint) {
        return address(this).balance;
    }

    //Fallback function
    function () public payable {         
        //Secutiry measure to stop user to send any malicious content alongwith the transaction
        require(msg.data.length == 0,"oops!!! Data length should be zero");         
        emit LogFallback(msg.sender,msg.value);     
    }
}