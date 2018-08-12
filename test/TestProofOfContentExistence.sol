pragma solidity ^0.4.18;

import 'truffle/DeployedAddresses.sol';
import 'truffle/Assert.sol';
import '../contracts/ProofOfContentExistence.sol';

contract TestProofOfContentExistence {

    function testAddNewDocument() public {
        ProofOfContentExistence  contentExistence = ProofOfContentExistence(DeployedAddresses.ProofOfContentExistence());
        bool expected = true;
        bool returned = contentExistence.addNewDocument("Dipankar","db@gmail.com","2018-08-10 10:41:02","degree-cert");
        Assert.equal(returned, expected, "Expected true");
    }

}