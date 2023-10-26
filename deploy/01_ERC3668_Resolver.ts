import {
    ERC3668Resolver__factory,
    SignatureCcipVerifier__factory
} from "ccip-resolver/dist/typechain/";
import { BigNumber } from "ethers";
import { keccak256, RLP } from "ethers/lib/utils";
import hre from 'hardhat';

const NAMEWRAPPER = process.env.NAME_WRAPPER;
const ENS_REGISTRY = process.env.ENS_REGISTRY;
const DEFAULT_VERIFIER_URL = process.env.GATEWAY_URL;

const graphQlurl = process.env.GRAPHQL_URL
const resolvername = process.env.RESOLVER_NAME
const resolverchainId = process.env.RESOLVER_CHAINID


async function main() {
    //Every env variable must be set. Otherwise we cannot deploy
    if (
        !(ENS_REGISTRY && DEFAULT_VERIFIER_URL && resolvername && resolverchainId)
    ) {
        console.log({
            SPACE_ID_REGISTRY: ENS_REGISTRY,
            DEFAULT_VERIFIER_URL,
            graphQlurl,
            resolvername,
            resolverchainId
        })
        throw ("Must set SPACE_ID_REGISTRY, DEFAULT_VERIFIER_URL, RESOLVER_NAME, RESOLVER_CHAINID")
    }

    const [deployer, signer] = await hre.ethers.getSigners();
    const nonce = await deployer.getTransactionCount();

    const resolverAddress =
        '0x' +
        keccak256(
            RLP.encode([deployer.address, BigNumber.from(nonce).add(1)._hex]),
        ).substring(26);




    const ownerAddress = deployer.address


    const deploySignatureVerifier =
        await new SignatureCcipVerifier__factory()
            .connect(deployer)
            .deploy(
                ownerAddress,
                graphQlurl,
                resolvername,
                resolverchainId,
                resolverAddress,
                [signer.address],
                { gasLimit: 5000000, gasPrice: 50000000, nonce: nonce }
            )

    await deploySignatureVerifier.deployed()
    console.log("calculated address", resolverAddress)
    console.log('SignatureCcipVerifier deployed to:', deploySignatureVerifier.address);

    const deployERC3668Tx = await
        new ERC3668Resolver__factory()
            .connect(deployer)
            .deploy(
                ENS_REGISTRY, NAMEWRAPPER, deploySignatureVerifier.address, [DEFAULT_VERIFIER_URL],
                { gasLimit: 5000000, gasPrice: 50000000, nonce: nonce + 1 }
            );


    await deployERC3668Tx.deployed();
    console.log('ERC3668Resolver deployed to:', deployERC3668Tx.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
module.exports.default = main;
