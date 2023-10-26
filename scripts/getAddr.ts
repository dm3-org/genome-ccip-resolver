import { ethers } from "hardhat";

export const getAddr = async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.L1_PROVIDER_URL);
    const resolver = await provider.getResolver(process.env.ENS_NAME);
    console.log("getting address record");

    const addr = await resolver.getAddress();
    console.log(addr);

};

getAddr();
