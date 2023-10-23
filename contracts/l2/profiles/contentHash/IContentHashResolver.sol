// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IContentHashResolver {
    event ContenthashChanged(bytes context, bytes name, bytes32 indexed node, bytes hash);

    /**
     * Returns the contenthash associated with an ENS node.
     * @param node The ENS node to query.
     * @return The associated contenthash.
     */
    function contenthash(bytes calldata context, bytes32 node) external view returns (bytes memory);
}
