var ProofOfExistence = artifacts.require('ProofOfExistence.sol')

contract('ProofOfExistence contract functionalities testing', function(accounts){

    //Test#1
   it('Test : Document fetch on Empty Contract',function(){
        let docHash = 0xf50aab0582350e332b469f450e38f45e77f0926dfe07cf56ee661707207a5419;
        return ProofOfExistence.deployed().then(function(instance){
            return instance.fetchDocument.call(docHash,{from:accounts[1]});
        }).then(function(result){
            let expected = 0x0;
            let actual = result[0];
            assert.equal( actual,expected,'Document does not exist in blockchain. Default value of bytes32 should be returned');
        })
    });

    //Test#2
    it('Test : Document upload functionality',function(){
        let docHash = 0xf50aab0582350e332b469f450e38f45e77f0926dfe07cf56ee661707207a5419;
        let docOwnerName = "DB";
        let ipfsHash = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7i";
        return ProofOfExistence.deployed().then(function(instance){
            instance.uploadDocument(docHash,docOwnerName,ipfsHash,{from:accounts[0]});
            return instance.fetchDocument.call(docHash,{from:accounts[0]});
        }).then(function(result){
            let expected = docHash;
            let actual = result[0];
            assert.equal( actual,expected,'Document Successfully Added');
        })
    });

    //Test#3
    it('Test : User Usage Rate Limiting - 3 upload per 120 sec',function(){
        let docHash1 = 0xff635631b30d2e777fe163f46ed76b398c06ff3c3ee1de335dfe1e30b14e4faf;
        let docHash2 = 0x340fa3ff9bb3f74457255e241750a9e9e6a6c945cc6292a378a56efbdc53ac15;
        let docHash3 = 0x094c8923cc85b2914c65315ae27d173aa20eca02f1bcab0e523206d0ee83a26a;
        let docHash4 = 0xd54bfd00b4dea3abc3cbe210eff7fff6387d43c1a54c97f16a37154036d51fc9;

        let ipfsHash1 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7i";
        let ipfsHash2 = "RmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7j";
        let ipfsHash3 = "SmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7k";
        let ipfsHash4 = "SmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7l";

        let docOwnerName = "DB";
        let accountOne = accounts[1];

        return ProofOfExistence.deployed().then(function(instance){
            // only 3 documents can be uploaded by a user with in 2 minutes time window
            // the fourth document should not be loaded in to blockchain
            instance.uploadDocument(docHash1,docOwnerName,ipfsHash1,{from:accountOne});
            instance.uploadDocument(docHash2,docOwnerName,ipfsHash2,{from:accountOne});
            instance.uploadDocument(docHash3,docOwnerName,ipfsHash3,{from:accountOne});
            instance.uploadDocument(docHash4,docOwnerName,ipfsHash4,{from:accountOne});
            return instance.fetchDocument.call(docHash4,{from:accountOne});
        }).then(function(result){
            console.log(result);
            let expected = 0x0;
            let actual = result[0];
            assert.equal( actual,expected,'Document does not exist in blockchain. Default value of bytes32 should be returned');
        })
    });

    //Test#4
    it('Test : User Usage Rate Limiting - Multiple documents by multiple users',function(){
        let docHash1 = 0xff635631b30d2e777fe163f46ed76b398c06ff3c3ee1de335dfe1e30b14e4faf;
        let docHash2 = 0x340fa3ff9bb3f74457255e241750a9e9e6a6c945cc6292a378a56efbdc53ac15;
        let docHash3 = 0x094c8923cc85b2914c65315ae27d173aa20eca02f1bcab0e523206d0ee83a26a;
        let docHash4 = 0xd54bfd00b4dea3abc3cbe210eff7fff6387d43c1a54c97f16a37154036d51fc9;
        
        let ipfsHash1 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7i";
        let ipfsHash2 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7j";
        let ipfsHash3 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7k";
        let ipfsHash4 = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7l";

        let docOwnerName = "DB";

        let accountOne = accounts[1];
        let accountTwo = accounts[2];
        let accountThree = accounts[3];

        return ProofOfExistence.deployed().then(function(instance){
            // only 3 documents can be uploaded by a user with in 2 minutes time window
            // the fourth document should not be loaded in to blockchain
            instance.uploadDocument(docHash1,docOwnerName,ipfsHash1,{from:accountOne});
            instance.uploadDocument(docHash2,docOwnerName,ipfsHash2,{from:accountTwo});
            instance.uploadDocument(docHash3,docOwnerName,ipfsHash3,{from:accountThree});
            instance.uploadDocument(docHash4,docOwnerName,ipfsHash4,{from:accountOne});

            return instance.fetchDocument.call(docHash2,{from:accountOne});
        }).then(function(result){
            //console.log(result);
            let expected = docHash2;
            let actual = result[0];
            assert.equal( actual,expected,'4 documents in 2 min, but 3 different users, which is fine');
        })
    });

    //Test#5
    it('Test :  Admin acces check',function(){
        let owner = accounts[0];
        return ProofOfExistence.deployed().then(instance=>{
            return instance.isAdmin.call(owner,{from:accounts[0]});
        }).then(result=>{
            let expected = false;
            let actual = result;
            assert.equal(actual,expected,"Account is not Admin");
        })
    });

    //Test#6
    it('Test :  Assign Admin',function(){
        let owner = accounts[0];
        let newAddress = accounts[1]
        return ProofOfExistence.deployed().then(instance=>{
            instance.assignAdminAccess(newAddress,{from:owner});
            return instance.isAdmin.call(newAddress,{from:newAddress});
        }).then(result=>{
            let expected = true;
            let actual = result;
            assert.equal(actual,expected,"New account provided assigned as Admin");
        })
    });

    //Test#7
    it('Test :  Revoke Admin access',function(){
        let owner = accounts[0];
        let newAddress = accounts[1]
        return ProofOfExistence.deployed().then(instance=>{
            instance.assignAdminAccess(newAddress,{from:owner});
            instance.revokeAdminAccess(newAddress,{from:owner});
            return instance.isAdmin.call(newAddress,{from:newAddress});
        }).then(result=>{
            let expected = false;
            let actual = result;
            assert.equal(actual,expected,"Admin access revoked. New account should no longer be Admin");
        })
    });

})