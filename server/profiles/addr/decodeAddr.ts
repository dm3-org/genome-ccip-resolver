import { ethers } from "ethers";
/**
Decodes the call data of addr(bytes 32) 
@param data - The data containing the namehash.
@returns An object containing the name.
@throws An error if the namehash doesn't match the ENS name.
*/
export function decodeAddr(data: ethers.utils.Result) {
    const node = data.node;
    const coinType = data.coinType;
    return { node, coinType };
}
