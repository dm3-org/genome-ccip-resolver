import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import bodyParser from "body-parser";
import { expect } from "chai";
import express from "express";
import { ethers } from "hardhat";
import request from "supertest";
import { L2PublicResolver } from "typechain";
import { GenomeHandler } from "../server/http/GenomeHandler";
import { BigNumber } from "ethers";
import { getResolverInterface } from "../server/utils/getResolverInterface";
import hre from 'hardhat';

describe("GenomeHandler", () => {
    let l2PublicResolver: L2PublicResolver;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let expressApp;
    beforeEach(async () => {
        [alice, bob] = await ethers.getSigners();
        const l2PublicResolverFactory = await ethers.getContractFactory("PublicResolver");
        l2PublicResolver = (await l2PublicResolverFactory.deploy()) as L2PublicResolver;
        expressApp = express();
        expressApp.use(bodyParser.json());
        expressApp.use(await GenomeHandler(ethers.provider, l2PublicResolver.address));
    });

    describe("Addr", () => {
        it.only("resolves address", async () => {
            const f = await hre.ethers.getContractFactory("spaceid-toolkit-contracts/contracts/resolvers/PublicResolver.sol")

            console.log(f)
            const name = ethers.utils.dnsEncode("alice.eth");
            const dnsName = ethers.utils.dnsEncode(name);
            const node = ethers.utils.namehash(name);

            await l2PublicResolver.connect(alice)["setAddr(bytes,address)"](dnsName, alice.address);

            const ccipRequest = getCcipRequest("addr(bytes32 node)", name, alice.address, node);

            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();
            const { slot, target } = res.body[1];

            const slotValue = await ethers.provider.getStorageAt(target, slot);
            expect(ethers.utils.getAddress(slotValue.substring(0, 42))).to.eq(alice.address);
        });
    });

    describe("Text", () => {
        it("resolves text", async () => {
            const name = ethers.utils.dnsEncode("alice.eth");
            const dnsName = ethers.utils.dnsEncode(name);
            const node = ethers.utils.namehash(name);

            await l2PublicResolver.connect(alice).setText(dnsName, "my-record", "my-record-value");
            const ccipRequest = getCcipRequest("text", name, alice.address, node, "my-record");

            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();
            const { slot, target } = res.body[1];

            const slotValue = await ethers.provider.getStorageAt(target, slot);

            expect(ethers.utils.toUtf8String(slotValue.substring(0, 32))).to.equal("my-record-value");
        });
    });
    describe("Version", () => {
        it("resolves text", async () => {
            const name = ethers.utils.dnsEncode("alice.eth");
            const dnsName = ethers.utils.dnsEncode(name);
            const node = ethers.utils.namehash(name);

            await l2PublicResolver.connect(alice).clearRecords(dnsName);
            const ccipRequest = getCcipRequest("text", name, alice.address, node, "my-record");

            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();
            const { slot, target } = res.body[0];

            const slotValue = await ethers.provider.getStorageAt(target, slot);

            expect(BigNumber.from(slotValue).toNumber()).to.equal(1);
        });
    })


});

const getCcipRequest = (sig: string, name: string, context: string, ...args: string[]) => {
    const iface = getResolverInterface();
    const innerReq = iface.encodeFunctionData(sig, args);
    const outerReq = iface.encodeFunctionData("resolveWithContext", [name, innerReq, context]);
    return outerReq;
};
