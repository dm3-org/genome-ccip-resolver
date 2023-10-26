import hre, { ethers } from "hardhat";

export const getText = async () => {

    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.L1_PROVIDER_URL);
    const resolver = await provider.getResolver(process.env.ENS_NAME);
    console.log("getting text record");
    const text = await resolver.getText("description");
    console.log(text);
};

getText();
