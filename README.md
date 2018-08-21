# Proof Of Existence DApp

## Overview
This application allows users to prove existence of some information by showing a time stamped picture/video. 
Once user logs into the DApp, th user can upload some data (pictures/video) and associated properties.
Users can retrieve necessary reference data about their uploaded items to allow other people to verify the data authenticity.

Data uploaded is stored in **IPFS**. The Hash of the document is stored **on chain**.

## Prerequisite
You need following tools 
* git
* MetaMask
* Truffle
* ganache
* npm

## Project Setup

1. Clone 
```git clone https://github.com/dbiswa4/proof-of-existence-dapp.git```

2. Go to the project folder
```cd proof-of-existence-dapp```

3. Install npm modules
```npm install```

4. Start a Blockchain locally
ganache-cli -a

5. Compile Contracts
```truffle compile```

6. Test contracts
```truffle test```

_**Do either Step 7 or Step 8**_
7. Migrate Contracts to local Blockchain
```truffle migrate```

8. Migrate Contracts to TestNet (Ropsten)
```truffle migrate --network ropsten```

9. Log in to MetaMask


## Future Developments
