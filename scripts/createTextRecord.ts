import { dnsEncode } from "ethers/lib/utils";
import hre from "hardhat";
import { L2PublicResolver__factory } from "typechain";

const l2ResolverAddress = process.env.L2_RESOLVER_ADDRESS
const ENS_NAME = process.env.ENS_NAME

export async function createTextRecord() {
    const L2PublicResolverFactory = (await hre.ethers.getContractFactory("L2PublicResolver")) as L2PublicResolver__factory;

    const L2PublicResolver = L2PublicResolverFactory.attach(l2ResolverAddress);

    const tx = await L2PublicResolver.setText(dnsEncode(ENS_NAME), "my-long-record", "m4rofm4ofm4ofm4oifm4foi4mfo4mfo4fm4kofmeofokfmof3mfoklme3klfm3lkefm3kofm4kfngo2i4m3mo3ekflkmy-record-value", {
        gasPrice: "900000",
        gasLimit: 500000,
    });

    const rec = await tx.wait();

    console.log(rec.transactionHash);
}

createTextRecord();
