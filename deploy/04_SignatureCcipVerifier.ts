import { BigNumber } from 'ethers';
import { keccak256, RLP } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

const RESOLVER_NAME = 'SignatureCcipVerifier';
const RESOLVER_CHAINID = 60;
const GraphQlUrl = 'http://localhost:8081/graphql';
async function main() {
    const [signer] = await ethers.getSigners();

    const SignatureVerifier = await ethers.getContractFactory('SignatureCcipVerifier');

    const nonce = await signer.getTransactionCount();
    const resolverAddr = '0x' + keccak256(RLP.encode([signer.address, BigNumber.from(nonce + 1)._hex])).substring(26);

    console.log('Resolver addr', resolverAddr);

    const deployTx = await SignatureVerifier.deploy(
        signer.address,
        GraphQlUrl,
        RESOLVER_NAME,
        RESOLVER_CHAINID,
        resolverAddr,
        ['0xfd312Fc584fF015D8A8E9CDcE8ca1073dD6cE18E'],
    );
    await deployTx.deployed();

    console.log(`SignatureCcipVerifier deployed at  ${deployTx.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
module.exports.default = main;
