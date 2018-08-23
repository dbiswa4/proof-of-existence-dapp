# Proof Of Existence DApp

## Overview
This application allows users to prove existence of some information by showing a time stamped picture/video. <br />
Once user logs into the DApp, th user can upload some data (pictures/video) and associated properties. <br />
Users can retrieve necessary reference data about their uploaded items to allow other people to verify the data authenticity. <br />

Data uploaded is stored in **IPFS**. The Hash of the document is stored **on chain**.

<br />
## Prerequisite
You need following tools <br />
* [git] (https://github.com/) <br />
* MetaMask <br />
* Truffle <br />
* ganache <br />
* npm <br />

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


<ToDo>

## Future Developments
