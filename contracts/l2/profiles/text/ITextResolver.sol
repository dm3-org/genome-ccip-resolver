// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface ITextResolver {
    event TextChanged(bytes context, bytes name, bytes32 indexed node, string indexed indexedKey, string key, string value);

    /**
     * Returns the text data associated with an ENS node and key.
     * @param node The ENS node to query.
     * @param key The text data key to query.
     * @return The associated text data.
     */
    function text(bytes calldata context, bytes32 node, string calldata key) external view returns (string memory);
}
