// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./profiles/ABIResolver.sol";
import "./profiles/AddrResolver.sol";
import "./profiles/ContentHashResolver.sol";
import "./profiles/InterfaceResolver.sol";
import "./profiles/NameResolver.sol";
import "./profiles/PubkeyResolver.sol";
import "./profiles/TextResolver.sol";
import "./Multicallable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../registry/SidRegistry.sol";
import "./profiles/TldNameResolver.sol";

/**
 * A more advanced resolver that allows for multiple records of the same domain.
 */
contract PublicResolver is
    Multicallable,
    ABIResolver,
    AddrResolver,
    ContentHashResolver,
    InterfaceResolver,
    NameResolver,
    PubkeyResolver,
    TextResolver,
    TldNameResolver,
    Ownable
{
    SidRegistry immutable sidRegistry;
    mapping(address => bool) trustedControllers;

    /**
     * A mapping of operators. An address that is authorised for an address
     * may make any changes to the name that the owner could, but may not update
     * the set of authorisations.
     * (owner, operator) => approved
     */
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Logged when an operator is added or removed.
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    constructor(
        SidRegistry _sidRegistry,
        address _trustedController,
        uint chainType
    ) AddrResolver(chainType) {
        sidRegistry = _sidRegistry;
        trustedControllers[_trustedController] = true;
    }

    /**
     * @dev See {IERC1155-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) external {
        require(
            msg.sender != operator,
            "ERC1155: setting approval status for self"
        );

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev See {IERC1155-isApprovedForAll}.
     */
    function isApprovedForAll(
        address account,
        address operator
    ) public view returns (bool) {
        return _operatorApprovals[account][operator];
    }

    function isAuthorised(bytes32 node) internal view override returns (bool) {
        if (
            trustedControllers[msg.sender]
        ) {
            return true;
        }
        address owner = sidRegistry.owner(node);
        return owner == msg.sender || isApprovedForAll(owner, msg.sender);
    }

    function supportsInterface(
        bytes4 interfaceID
    )
        public
        pure
        override(
            Multicallable,
            ABIResolver,
            AddrResolver,
            ContentHashResolver,
            InterfaceResolver,
            NameResolver,
            PubkeyResolver,
            TldNameResolver,
            TextResolver
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceID);
    }

    function setNewTrustedController(address newController) external onlyOwner {
        trustedControllers[newController] = true;
    }

    function removeTrustedController(address controller) external onlyOwner {
        trustedControllers[controller] = false;
    }
}
