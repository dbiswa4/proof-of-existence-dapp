# Proof Of Existence DApp

## Overview
This application allows users to prove existence of some information by showing a time stamped picture/video. Once user logs into the DApp, th user can upload some data (pictures/video) and associated properties.

Users can retrieve necessary reference data about their uploaded items to allow other people to verify the data authenticity.

Data uploaded is stored in **IPFS**. The Hash of the document is stored **on chain**.

## Pre-requisites
You need following tools:

* nodejs 8.11.3
* npm 6.1.0
* git
* MetaMask
* Truffle 4.1.13
* ganache-cli
* Solidity 0.4.24 (solc-js)

_You can use the **version** mentioned or higher_

## Project Setup
1. Clone the repository <br />
```
cd ~
git clone https://github.com/dbiswa4/proof-of-existence-dapp.git
```

2. Go to the project folder <br />
```cd proof-of-existence-dapp```

3. Install npm modules <br />
```npm install```

4. Start a Blockchain locally <br />
```ganache-cli -a```

5. Compile Smart Contracts <br />
```truffle compile```

6. Run the tests <br />
```truffle test```

7. Migrate Contracts to local Blockchain <br />
```truffle migrate```

## Launch and Interact with the DApp
Once you finish all of the Project Setup steps, you can proceed with following steps.
1. Log in to **Metamask** in your favourite browser
2. Connect to Private Netwrok (```LocalHost 8545```) in Metamask
3. Go to the folder where you set up the app <br />
```cd ~/proof-of-existence-dapp```
4. Start the app <br />
```npm run start```
5. Open the app
```http://localhost:3000/home```

## Verify IPFS Connectivity
```
curl -H "Origin: https://ipfs.infura.io" \
-H "Access-Control-Request-Method: POST" \
-H "Access-Control-Request-Headers: X-Requested-With" \
--verbose \
https://ipfs.infura.io:5001/api/v0/swarm/peers; echo	

curl \
-H "Origin: http://infurarocks.com" \
-H "Access-Control-Request-Method: GET" \
-H "Access-Control-Request-Headers: X-Requested-With" \
-H "Cache-Control: no-cache" \
--verbose https://ipfs.infura.io/api/v0/cat?arg=QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```

## Testnet deployment
1. Update below variable with 12 word mnemonic in ```truffle.js``` or ```truffle-config.js``` file <br />

```var mnemonic = "upper box xxx xxx xxx"```

3. Change network selection in Metamask to Ropsten or Rinkeby. 
4. Migrate your contracts to TestNet (Ropsten or Rinkeby) <br />
```truffle migrate --network ropsten```
4. Run the app 
```npm run start``` 

## App Functionalities Summary
The app have 3 pages as of now:

_Home : Landing Page. Shows details of all the documents you have uploaded to Blockchain & IPFS using the app_
_Upload : Upload the document to IPFS and document Hash to Blockchain_
_Verify: Given a document it verifies the ownership by looing into existence of it in Blockchain_

When you login first time, it shows all the documents you have used this app for in the Home page. It also displays the External account you are logged in with.

## Commons Issues
1. Not logged in to MetaMask - Error Messaged pop up
2. Blockchain is not started when running in local mode


## Project Specifications
* Success run of the app on a dev server locally.
* Able to visit URL and interact with the app.
* App displays the current account, Signs transactions using metamask, Reflects updates to to the contract state.
* Test cases for all the contracts with explanation.
* Tests are properly structured (i.e. sets up context, executes a call on  the function to be tested, and verifies the result is correct).
* Tests provide adequate coverage for the contracts.
* All tests passed.

* Circuit breaker or Emergency stop feature included.
* Design Patterns used.
    * Mortal
    * Restricted Access using Admins
    * Rate Limiting

* Measures taken to ensure that their contracts are not susceptible to common attacks
    * Data Length verified in fallback method
    * Length of the string passed to the Contract is verified
    * Kill and Withdrwal functions are protected by modifiers

* Library - project contracts includes an import from a library
* Smart Contract codes commented according to the specs in the documentation <br /> https://solidity.readthedocs.io/en/v0.4.21/layout-of-source-files.html#comments

* Project uses **IPFS**
* Testnet Deployment
    * Ropsten

## Technology Stack

* [Ethereum](https://www.ethereum.org/) - Blockchain App Platform
* [Solidity](https://solidity.readthedocs.io/en/latest/) - Smart Contract Language
* [IPFS](https://reactjs.org/docs/getting-started.html) - Decentralised storage
* [Metamask](https://metamask.io/) - Wallet service
* [ReactJs](https://reactjs.org/docs/getting-started.html) - React Frontend Development 
* [NodeJs](https://nodejs.org/en/) - JavaScript Runtime
* [npm](https://www.npmjs.com/) - Node Package Manager
* [coreui](https://coreui.io/v1/docs/getting-started/introduction/#reactjs) - UI Components


## Future Developments
* _Implementing Upgradable Design Pattern_
* _Admin/Authrization Page in the App_
* _ENS integration_
* _Other app functionalities enhancements_

## Author
* **Dipankar Biswas** - *Proof of Existence DApp* - [dbiswa4](https://github.com/dbiswa4)
