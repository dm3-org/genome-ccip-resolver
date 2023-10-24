import { getResolverInterface } from "../utils/getResolverInterface";

import { Contract, ethers } from "ethers";
import { decodeAddr } from "../profiles/addr/decodeAddr";
import { decodeText } from "../profiles/text/decodeText";
import { PublicResolver } from "typechain";



export async function handleGenomeCcipRequest(PublicResolver: PublicResolver, calldata: string) {
    try {
        const l2Resolverinterface = getResolverInterface();

        //Parse the calldata returned by the contract
        const [name, data] = l2Resolverinterface.parseTransaction({
            data: calldata,
        }).args;


        const { signature, args } = l2Resolverinterface.parseTransaction({
            data,
        });


        switch (signature) {
            case "text(bytes32,string)":
                {
                    const { node, record } = decodeText(args);
                    const result = await PublicResolver.text(node, record)

                    return ethers.utils.defaultAbiCoder.encode(['string'], [result]);
                }
            case "addr(bytes32)":
                {
                    const { node } = decodeAddr(args);
                    const result = await PublicResolver["addr(bytes32)"](node)

                    return ethers.utils.hexlify(result);
                }
            case "addr(bytes32,uint256)": {
                const { node, coinType } = decodeAddr(args);
                const result = await PublicResolver["addr(bytes32,uint256)"](node, coinType)
                return ethers.utils.hexlify(result);
            }
            default:
                //Unsupported signature
                return null
        }
    } catch (err: any) {
        console.log("[Handle Genome-CCIP request ] Cant resolve request ");
        console.log(err);
        throw err;
    }
}
