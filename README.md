# Proof Of Existence DApp

## Overview
This application allows users to prove existence of some information by showing a time stamped picture/video. <br />
Once user logs into the DApp, th user can upload some data (pictures/video) and associated properties. <br />
Users can retrieve necessary reference data about their uploaded items to allow other people to verify the data authenticity. <br />

Data uploaded is stored in **IPFS**. The Hash of the document is stored **on chain**.

## Pre-requisites

You need following tools: <br />
* nodejs 8.11.3 <br />
* npm 6.1.0 <br />
* git (https://github.com/) <br />
* MetaMask <br />
* Truffle 4.1.13 <br />
* ganache-cli <br />
* Solidity 0.4.24 (solc-js)

## Environment Setup


## Project Setup

1. Clone the repository <br />
```git clone https://github.com/dbiswa4/proof-of-existence-dapp.git```

2. Go to the project folder <br />
```cd proof-of-existence-dapp```

3. Install npm modules <br />
```npm install```

4. Start a Blockchain locally <br />
ganache-cli -a

5. Compile Contracts <br />
```truffle compile```

6. Test contracts <br />
```truffle test```

_**Do either Step 7 or Step 8**_ <br />
7. Migrate Contracts to local Blockchain <br />
```truffle migrate```

8. Migrate Contracts to TestNet (Ropsten) <br />
```truffle migrate --network ropsten```

9. Log in to MetaMask <br />


## Project Specifications
* Success run of the app on a dev server locally <br />
* Able to visit URL and interact with the app <br />
* App displays the current account, Signs transactions using metamask, Reflects updates to to the contract state <br />
* Test cases for all the contracts with explanation <br />
* Tests are properly structured (i.e. sets up context, executes a call on  the function to be tested, and verifies the result is correct) <br />
* Tests provide adequate coverage for the contracts <br />
* All tests pass <br />

* Circuit breaker or Emergency stop feature included <br />
* Design Patterns used <br />
    * Mortal <br />
    * Restricted Access using Admins <br />
    * Rate Limiting <br />

* Measures taken to ensure that their contracts are not susceptible to common attacks <br />
    * 

* Library - project contracts includes an import from a library <br />
* Smart Contract codes commented according to the specs in the documentation <br /> https://solidity.readthedocs.io/en/v0.4.21/layout-of-source-files.html#comments

* Project uses **IPFS** <br />
* Testnet Deployment <br />
    * Ropsten <br />

## Future Developments
* **Implementing Upgradable Design Pattern**
* **Admin/Authrization Page in the App**
* **ENS integration**

