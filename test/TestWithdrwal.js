
var ProofOfExistence = artifacts.require('ProofOfExistence.sol');
var Web3 = require('web3');

contract('Test : Ether transfer and circuit breaker', function (accounts) {

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    let transferAmt = 1;

    it('Send Ether from external account to contract account', function () {

        let accountThree = accounts[3];
        let proofOfExistenceInstance;
        let finalBal;
        
        ProofOfExistence.deployed().then((instance) => {
            proofOfExistenceInstance = instance;
            // Send ether from external account to contract account
            return instance.send(web3.toWei(1, "ether"), { from: accountThree });
        }).then((transReceipt) => {
            finalBal = web3.fromWei(web3.eth.getBalance(proofOfExistenceInstance.address), "ether").valueOf();
            var actual = finalBal;
            var expected = transferAmt;
            assert.equal(expected, actual, "Contract balance expected to be 1")
        })
    });

    it('Check balance of the contract account', function () {
        let accountThree = accounts[3];
        ProofOfExistence.deployed().then((instance) => {
            return instance.checkBalance.call({ from: accountThree });
        }).then((result) => {
            let expected = transferAmt;
            let actual = web3.fromWei(result, "ether").valueOf();
            assert.equal(expected, actual, "Contract balance 1")
        })
    });

    /*
    Only owner should be able to withdraw funds from contract address. Additionally, Contract needs to be 
    paused before funds can be transfered
    */
    it('Test funds withdrwal from contract address', function () {

        let finalAcctBalance;
        let contractBal;
        let accountZero = accounts[0];
        let proofOfExistenceInstance;
        let initialAcctBal;
        let finalContractBal;
        
        ProofOfExistence.deployed().then((instance) => {
            proofOfExistenceInstance = instance;
            initialAcctBal = web3.fromWei(web3.eth.getBalance(accountZero), "ether").valueOf();
            contractBal = web3.fromWei(web3.eth.getBalance(proofOfExistenceInstance.address), "ether").valueOf();
            proofOfExistenceInstance.toggleContractActive({from : accountZero});
            return proofOfExistenceInstance.withdrawFunds({ from: accountZero });
        }).then((withdrwalFlag) => {
            finalAcctBalance = web3.fromWei(web3.eth.getBalance(accountZero), "ether").valueOf();
            finalContractBal = web3.fromWei(web3.eth.getBalance(proofOfExistenceInstance.address), "ether").valueOf();
            //console.log("Final Contract Balance : ", finalContractBal);
            let expected = Math.round(initialAcctBal) + Math.round(contractBal);
            let actual = Math.round(finalAcctBalance);
            assert.equal(expected, actual,"Final External Account balance ");
            assert.equal(0, finalContractBal,"Final Contract Account balance ");
        })
    });

})