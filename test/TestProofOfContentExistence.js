
var ProofOfContentExistence = artifacts.require('ProofOfContentExistence.sol')

contract('Test ProofOfContentExistence', function(accounts){

    it('Adding document functionality test',function(){

        return ProofOfContentExistence.deployed().then(function(instance){
            //console.log(instance);
            instance.addNewDocument("Dipankar","db@gmail.com","2018-08-10 10:41:02","degree-cert",{from:accounts[0]});
            return instance.getDocumentDetails.call("degree-cert",{from:accounts[0]});
        }).then(function(result){
            //console.log(result);
            let expected = "degree-cert";
            let returned = result[3];
            assert.equal(expected, returned,'Expected true');
        })

    })


})

