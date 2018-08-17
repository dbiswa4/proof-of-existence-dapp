var Mortal = artifacts.require('Mortal.sol');

contract('Tests for Mortal Contract',function(accounts){
    it('Test owner access',function(){
        return Mortal.deployed().then( function(instance){
            return instance.owner.call({from:accounts[0]});
        }).then(function(result) {
            let expected = accounts[0]
            let actual = result
            assert.equal(actual,expected,'owner should be  ' + expected + 'for successful execution');
        })
        
    });



})