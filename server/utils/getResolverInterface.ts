import { ethers } from "ethers";

//TODO maybe remove everything except resolveWithProof
export function getResolverInterface() {
    return new ethers.utils.Interface([
        "function resolveWithContext(bytes calldata name,bytes calldata data,bytes calldata context) external view returns (bytes memory result)",
        // eslint-disable-next-line max-len
        "function resolveWithProof(bytes calldata response, bytes calldata extraData) external view returns (bytes memory)",
        //Text
        "function text(bytes32 node, string calldata key) external view returns (string memory)",
        //Address
        "function resolveWithAddress(bytes calldata response, bytes calldata extraData) public view returns (address)",
        "function addr(bytes32 node) external view returns (address)",
        "function addr(bytes32 node,uint256 coinType) external view returns (bytes)",
        //ABI
        "function ABI(bytes32 node,uint256 contentTypes) external view returns(uint256, bytes memory)",
        //ContentHash
        "function contenthash(bytes calldata context, bytes32 node) external view returns (bytes memory)",
        "function contenthash(bytes32 node) external view returns (bytes memory)",
        //Interface
        "function interfaceImplementer (bytes calldata context, bytes32 node, bytes4 interfaceID) external view returns (address)",
        //Name
        "function name(bytes32 node) external view returns (string memory)",
        //DNS
        "function dnsRecord(bytes32 node,bytes32 name,uint16 resource) public view  returns(bytes memory)",
        "function zonehash(bytes32 node) external view  returns (bytes memory)"
    ]);
}
