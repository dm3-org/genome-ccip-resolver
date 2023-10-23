import { getResolverInterface } from "../utils/getResolverInterface";

import { Contract, ethers } from "ethers";
import { decodeAddr } from "../profiles/addr/decodeAddr";
import { decodeText } from "../profiles/text/decodeText";


function getEthersFormat(address: string) {
    return ethers.utils.hexlify(address);
}


export async function handleGenomeCcipRequest(PublicResolver: Contract, calldata: string) {
    try {
        const l2Resolverinterface = getResolverInterface();

        //Parse the calldata returned by the contract
        const [data] = l2Resolverinterface.parseTransaction({
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

                    return getEthersFormat(result)
                }
            case "addr(bytes32)":
                {
                    const { node } = decodeAddr(args);
                    const result = await PublicResolver["addr(bytes32)"](node)

                    return getEthersFormat(result)
                }
            case "addr(bytes32,uint256)": {
                const { node, coinType } = decodeAddr(args);
                const result = await PublicResolver["addr(bytes32,uint256)"](node, coinType)
                return getEthersFormat(result)
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
