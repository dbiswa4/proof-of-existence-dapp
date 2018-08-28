# Design Patterns
Overview of the deisgn patterns implemented in the project.

## Mortal
Allows owner and only the owner to kill the contract. Any Ether balance is transferred to owner account. Refer to Mortal.sol.

## Restricting Access
Restricting function access so that only specific addresses are permitted to execute functions. Modifiers are used to do the same.
Refer to the below modifiers in ProofOfExistence.sol.

## Circuit Breaker
Circuit Breakers are design patterns that allow contract functionality to be stopped.
Refer to the below modifiers in ProofOfExistence.sol.

```
    function toggleContractActive() public 
    onlyOwner {
        stopped = !stopped;
    }
```

## Pull over push
To have the ether transferred to to owners account.

Please refer to withdrawFunds() in ProofOfExistence.sol.

## Rate Limiting
To limit a user to perfom a number of state change in a certain duration. This is implementated in verifyRateLimit() method.






