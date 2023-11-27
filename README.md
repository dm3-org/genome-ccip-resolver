# Genome CCIP-Resolver

The repository contains a CCIP resolver that can be used to resolve .GNO names on Gnosis Chain from Ethereum Mainnet using CCIP-READ. It contains a Node.js Gateway that resolves the requested data and deployment scripts needed to set up all the required contracts.


To use the GNO domain resolver, the owner of the .gno domain has to change the resolver contract in the ENS app to the contract of the GNO domain resolver. This contract returns a URL to a CCIP-Read client like ethers.js. This URL can be used to perform an off-chain lookup instead of fetching the records from the contract directly.

When calling the URL, the Gateway resolves the request by using the Gnosis RPC provider to query the data from the SpaceId contract on the Gnosis Chain. The data returned is signed by the gateway and then returned to the Read Client. To add additional security, the gateway signs the response before, so only "trusted" gateways can be used.

Newly minted domains can be resolved as soon as the transaction to set them was successful

## Setup environment
1. Install dependencies with ```yarn install```
2. Create a new env file  ```touch .env```
3. Copy example.env to the .env file you've just created
4. Add your own environmental variables to .env

## Run tests
After you've set up the environment, you can execute the test suite using ```yarn test```

## Deploy Contracts
There is a script that deploys the contract needed for the resolver on Goerli.
Simply run ```yarn deploy:l1-resolver-goerli``` to deploy them. 
For the mainnet deployment run ```yarn deploy:l1-resolver-mainnet```

## Deploy Gateway
The docker-compose.yml contains everything you need to deploy the gateway. Simply run docker-compose up after you've set up the environment

## Deployments

### Goerli
**SignatureCcipVerifier** : 0xaf23aEd91a9f68309d4A21752b1555526156EA8c  
**ERC3668Resolver** : 0x26139B2349282dE5EE2BD9C7a53171A28D6a6c84

### Ethereum Mainnet 
**SignatureCcipVerifier** : 0xfbbc1e3f42ebd9e80919913271ed2fae922e26d8  
**ERC3668Resolver** : 0xc9bf092673b3a066df088a2a911e23e9b69b82f2

