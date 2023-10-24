import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import bodyParser from "body-parser";
import { expect } from "chai";
import express from "express";
import { ethers } from "hardhat";
import request from "supertest";
import { L2PublicResolver, PublicResolver } from "typechain";
import { GenomeHandler } from "../server/http/GenomeHandler";
import { BigNumber } from "ethers";
import { getResolverInterface } from "../server/utils/getResolverInterface";
import hre from 'hardhat';
import { ETHBridgeAdapter } from "@eth-optimism/sdk";
import { FakeContract, smock } from "@defi-wonderland/smock";

describe("GenomeHandler", () => {

    let ensRegistry: FakeContract;
    let publicResolver: PublicResolver;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let expressApp;
    beforeEach(async () => {
        [alice, bob] = await ethers.getSigners();

        ensRegistry = (await smock.fake(
            'SidRegistry',
        )) as FakeContract;
        ensRegistry.owner.whenCalledWith(ethers.utils.namehash('alice.eth')).returns(alice.address);

        const PublicResolverFactory = await ethers.getContractFactory("PublicResolver");
        publicResolver = (await PublicResolverFactory.deploy(
            ensRegistry.address,
            ethers.constants.AddressZero,
            ethers.constants.Zero,
        )) as PublicResolver;
        expressApp = express();
        expressApp.use(bodyParser.json());
        expressApp.use(await GenomeHandler(ethers.provider, publicResolver.address));
    });

    describe("Addr", () => {
        it("resolves address", async () => {
            const name = "alice.eth"
            const node = ethers.utils.namehash(name);

            await publicResolver.connect(alice)["setAddr(bytes32,address)"](node, alice.address);

            const ccipRequest = getCcipRequest("addr(bytes32 node)", ethers.utils.dnsEncode(name), alice.address, node);
            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();

            expect(res.text).to.equal(ethers.utils.hexlify(alice.address));
        });
        it("returns address zero if address is undefined", async () => {
            const name = "alice.eth"
            const node = ethers.utils.namehash(name)


            const ccipRequest = getCcipRequest("addr(bytes32 node)", ethers.utils.dnsEncode(name), alice.address, node);
            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();

            expect(res.text).to.equal(ethers.constants.AddressZero);
        });
    });

    describe("Text", () => {
        it("returns text", async () => {
            const name = "alice.eth";

            const node = ethers.utils.namehash(name);

            await publicResolver.connect(alice).setText(node, "my-record", "my-record-value");
            const ccipRequest = getCcipRequest("text", ethers.utils.dnsEncode(name), alice.address, node, "my-record");

            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();

            expect(res.text).to.equal(ethers.utils.defaultAbiCoder.encode(['string'], ["my-record-value"]));

        });
        it("resolves 0x if record not exist", async () => {
            const name = "alice.eth";
            const node = ethers.utils.namehash(name);

            const ccipRequest = getCcipRequest("text", ethers.utils.dnsEncode(name), alice.address, node, "my-record");

            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();
            expect(res.text).to.equal(ethers.utils.defaultAbiCoder.encode(['string'], [""]));

        });
    });
    describe("Name", () => {
        it("returns name", async () => {
            const name = "alice.eth";

            const node = ethers.utils.namehash(name);

            await publicResolver.connect(alice).setName(node, "alice.eth");
            const ccipRequest = getCcipRequest("name", ethers.utils.dnsEncode(name), alice.address, node);

            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();

            expect(res.text).to.equal(ethers.utils.defaultAbiCoder.encode(['string'], ["alice.eth"]));

        });
        it("resolves 0x if record not exist", async () => {
            const name = "alice.eth";
            const node = ethers.utils.namehash(name);

            const ccipRequest = getCcipRequest("name", ethers.utils.dnsEncode(name), alice.address, node);

            const res = await request(expressApp).get(`/${ethers.constants.AddressZero}/${ccipRequest}`).send();
            expect(res.text).to.equal(ethers.utils.defaultAbiCoder.encode(['string'], [""]));

        });
    });

});

const getCcipRequest = (sig: string, name: string, context: string, ...args: string[]) => {
    const iface = getResolverInterface();
    const innerReq = iface.encodeFunctionData(sig, args);
    const outerReq = iface.encodeFunctionData("resolveWithContext", [name, innerReq, context]);
    return outerReq;
};
