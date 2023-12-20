import { getResolverInterface } from "../utils/getResolverInterface";

import { ethers } from "ethers";
import { decodeAddr } from "../profiles/addr/decodeAddr";
import { decodeText } from "../profiles/text/decodeText";
import { trimEthLabel } from "../utils/trimEthLabel";
import { PublicResolver } from "./../../typechain";
import { getSpaceIdNode } from "../utils/spaceIDNode";
import { replaceL1Label } from "../utils/replaceL1Label";



export async function handleGenomeCcipRequest(publicResolver: PublicResolver, calldata: string) {
    try {
        const l2Resolverinterface = getResolverInterface();

        //Parse the calldata returned by the contract
        const [name, data] = l2Resolverinterface.parseTransaction({
            data: calldata,
        }).args;


        const { signature, args } = l2Resolverinterface.parseTransaction({
            data,
        });

        //Comming from Ethereum Mainnet the node contains the .eth label which is not needed on L2.
        //Hence we remove it to get the pure 2 node
        //foo.gno.eth => foo.gno
        const nodeWithoutEth = trimEthLabel(name);

        //The label that on L1 would be the namespace of genome (in production it is .gnosis.eth) will be replaced to the genome namespace (.gno)
        const nodeWithL1Label = replaceL1Label(nodeWithoutEth)

        //Space Id has a different naming style we need to handle
        const spaceIdNode = getSpaceIdNode(nodeWithL1Label)

        switch (signature) {
            case "text(bytes32,string)":
                {
                    const { record } = decodeText(args);
                    const result = await publicResolver.text(spaceIdNode, record)
                    return ethers.utils.defaultAbiCoder.encode(['string'], [result]);
                }
            case "name(bytes32)":
                {
                    const result = await publicResolver.name(spaceIdNode)
                    return ethers.utils.defaultAbiCoder.encode(['string'], [result]);
                }
            case "addr(bytes32)":
                {
                    const result = await publicResolver["addr(bytes32)"](spaceIdNode)
                    return ethers.utils.hexlify(result);
                }
            case "addr(bytes32,uint256)": {
                const { coinType } = decodeAddr(args);
                const result = await publicResolver["addr(bytes32,uint256)"](spaceIdNode, coinType)
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
