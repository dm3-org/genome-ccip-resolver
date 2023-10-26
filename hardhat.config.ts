/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
import "dotenv/config";
import "solidity-coverage";
import "hardhat-storage-layout";
import "hardhat-tracer";
import { ethers } from "ethers";

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? ethers.Wallet.createRandom().privateKey;
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY ?? ethers.Wallet.createRandom().privateKey;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const L1_PROVIDER_URL = process.env.L1_PROVIDER_URL;

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: L1_PROVIDER_URL,
            accounts: [DEPLOYER_PRIVATE_KEY, SIGNER_PRIVATE_KEY],
        },

        localhost: {},

    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
    },
    solidity: {
        compilers: [
            {
                version: '0.8.17',
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        details: {
                            yulDetails: {
                                optimizerSteps: 'u',
                            },
                        },
                    },
                },
            },
        ],
    },
    mocha: {
        timeout: 100000,
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
};
