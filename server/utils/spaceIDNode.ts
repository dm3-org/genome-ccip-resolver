import { Address, namehash, toHex } from "viem"

const GNO_IDENTIFIER = BigInt('274997945614032132263423446017095573970170942858695765128406315342190546')

export function getSpaceIdNode(inputName: string): Address {
    const fullNameNode = `${inputName}.[${toHex(GNO_IDENTIFIER, { size: 32 }).slice(2)}]`
    return namehash(fullNameNode)

}