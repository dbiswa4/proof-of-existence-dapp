pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofOfExistence.sol";

/*
https://truffleframework.com/docs/truffle/testing/writing-tests-in-solidity
*/

contract TestProofOfExistence {

event LogBal(address _sender, uint _bal);

  // Truffle will send the TestContract one Ether after deploying the contract.
  uint public initialBalance = 1 ether;

//Check Balance with send()
function testCheckBalance() public {
    ProofOfExistence proofOfExistence = ProofOfExistence(DeployedAddresses.ProofOfExistence());
    // perform an action which sends value to myContract, then assert.
    //send() method actually induce fallback method execution in ProofOfExistence contract
    address(DeployedAddresses.ProofOfExistence()).send(0.1 ether);
    uint bal = proofOfExistence.checkBalance();
    uint expectedBal = 0.1 ether;
    emit LogBal(DeployedAddresses.ProofOfExistence(), address(DeployedAddresses.ProofOfExistence()).balance);
    emit LogBal(DeployedAddresses.ProofOfExistence(), bal);
    Assert.equal(bal, expectedBal, "Expected balance is 0.5 ether");
  }

  //Check Balance with transfer()
  function testCheckBalanceTransfer() public {
    ProofOfExistence proofOfExistence = ProofOfExistence(DeployedAddresses.ProofOfExistence());
    // perform an action which sends value to myContract, then assert.
    address(DeployedAddresses.ProofOfExistence()).transfer(0.05 ether);
    uint bal = proofOfExistence.checkBalance();
    uint expectedBal = 0.15 ether;
    emit LogBal(DeployedAddresses.ProofOfExistence(), address(DeployedAddresses.ProofOfExistence()).balance);
    emit LogBal(DeployedAddresses.ProofOfExistence(), bal);
    Assert.equal(bal, expectedBal, "Expected balance after subsequent transfer is 1 ether");
  }

  //Test fallback method. It should be able to accept ether
  function testFallback() public {
    ProofOfExistence proofOfExistence = ProofOfExistence(DeployedAddresses.ProofOfExistence());

    //Fallback function will be called
    address(DeployedAddresses.ProofOfExistence()).call.value(0.1 ether)();
    uint bal = proofOfExistence.checkBalance();
    //Because we already transferred total 0.15 ether in previous two tests
    uint expectedBal = 0.25 ether;
    emit LogBal(DeployedAddresses.ProofOfExistence(), bal);
    Assert.equal(bal, expectedBal, "Expected balance is 0.25 ether");
  }

}
