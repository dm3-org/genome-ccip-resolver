import { Address, namehash, toHex } from "viem"

//Space ID Node Identifier for Gnosis Mainnet. Changes for every network.
const GNO_MAINNET_IDENTIFIER = BigInt('2702484275810670337286593638197304166435784191035983069259851825108946')

export function getSpaceIdNode(inputName: string): Address {
    const fullNameNode = `${inputName}.[${toHex(GNO_MAINNET_IDENTIFIER, { size: 32 }).slice(2)}]`
    return namehash(fullNameNode)

}