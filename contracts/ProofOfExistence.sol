pragma solidity ^0.4.18;

contract ProofOfExistence is Mortal{

    mapping(address => bool) admins;
    mapping( string => Document) documents;
    mapping(address => UserUsageCount) usersUsage;
    uint documentUploadPeriod = 120 seconds;
    uint documentLimit = 3;
    bool private stopped = false;
    
    //Document upload actions. To be used for user throtling
    enum UploadChoices { UPLOAD_CNT_INCR, UPLOAD_CNT_RESET, UPLOAD_NO }
    UploadChoices uploadChoice;
    UploadChoices constant defaultUploadChoice = UploadChoices.UPLOAD_NO;

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

    mapping (address => User) users;

    //Maintain user usage count to implement throtlling
    struct UserUsageCount {
        uint uploadTime;
        uint count;
    }


    //Events for logging
    event LogUploadDocument(address _addr,string _userName, bytes32 _dochash, uint _docTimestamp, string _ipfsHash);
    event LogAssignAdmin(address _sender, string _message);

    //Modifiers
    modifier onlyOwner(){require(msg.sender == owner, "msg sender is not owner"); _;}
    modifier onlyAdmin(){require(admins[msg.sender] == true,"Sender is not Admin"); _;}
    modifier stopInEmergency {if (!stopped) _;}
    modifier onlyInEmergency {if (stopped) _;}

    //Circuit Breaker to pause the contract in case of Emergency
    function toggleContractActive() public 
    onlyAdmin {
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

    //Upload document hash to Blockchain
    function uploadDocument(bytes32 _docHash,string _userName,string _ipfsHash) 
    public
    stopInEmergency 
    returns(bool) {
        UserUsageCount storage userUploadStats = usersUsage[_addr];
        UploadChoices choice = verifyRateLimit(msg.sender, userUploadStats);

        if (choice == UploadChoices.UPLOAD_CNT_INCR) {
            updateOnChainData(_docHash,_userName,_ipfsHash);
            usersUsage[msg.sender].time = now;
            usersUsage[msg.sender].count = 1;
            //Log document upload event
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp, _ipfsHash, "Upload Success - Throtling count reset");
        } else if (choice == UploadChoices.UPLOAD_CNT_RESET) {
            updateOnChainData(_docHash,_userName,_ipfsHash);
            usersUsage[msg.sender].count += 1;
            //Log document upload event
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp, _ipfsHash, "Upload Success");

        } else if (choice == UploadChoices.UPLOAD_NO){
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp, _ipfsHash, "Upload Not Success - throtling limit exceeded");
        } else {
            return false;
        }
        return true;
    }

    function updateOnChainData(bytes32 _docHash,string _userName,string _ipfsHash) 
    private
    returns(bool) {
        //check whether the document already exists in the blockchain
        //if the document does not exist then add the document details and return true
        //if the document already exists then do nothing and return false

        //ToDo: Whether to move check for already existing case to throtling function?

        if(users[msg.sender].documentDetails[_docHash].docHash == 0){
            users[msg.sender].addr = msg.sender;
            users[msg.sender].userName = _userName;
            users[msg.sender].documentList.push(_docHash);
            users[msg.sender].documentDetails[_docHash] = Document(_docHash,block.timestamp,_ipfsHash);
            //users[msg.sender].lastUploadTimestamp = block.timestamp;
        }else {
            return false;
        }
        return true;
    }

    
    //verify whether user exceeded rate limit assigned
    function verifyRateLimit(address _addr, UserUsageCount _userUploadStats)
    public
    view
    returns(UploadChoices) {

        if(block.timestamp >= _userUploadStats.time + documentUploadPeriod){
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
    returns(bytes32, uint, string){
        require(_docHash != 0, "Document Hash is mandatory");
        
        Document storage document = users[msg.sender].documentDetails[_docHash];
        emit LogUploadDocument(msg.sender,users[msg.sender].userName,document.docHash, document.docTimestamp,document.ipfsHash);
        return(document.docHash,document.docTimestamp,document.ipfsHash);
    }

    //To fetch all the documents for a user
    function fetchAllDocuments() public view returns(bytes32[]){
        return users[msg.sender].documentList;
    }
}