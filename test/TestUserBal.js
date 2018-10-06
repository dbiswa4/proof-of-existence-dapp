var UserBal = artifacts.require('UserBal.sol')

contract('UserBal contract functionalities testing', function(accounts){

    //Test#1
   it('Test : User Balance should be 0',function(){
        return UserBal.deployed().then(function(instance){
            let assetSymbol = "DAI";
            return instance.getTokenBal.call(assetSymbol,{from:accounts[1]})
        }).then(function(result){
            let expected = 0;
            let actual = result;
            assert.equal( actual,expected,'User Token balance should be zero');
        })
    });

})