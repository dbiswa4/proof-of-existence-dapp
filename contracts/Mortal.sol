pragma solidity ^0.4.18;

contract Owned {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

}

contract Mortal is Owned {
    
    function kill() public {
        require(msg.sender == owner, "Only owner can kill the contract");
        selfdestruct(owner);
    }
}
