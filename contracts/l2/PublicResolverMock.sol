pragma solidity >=0.8.4;

import "spaceid-toolkit-contracts/contracts/resolvers/PublicResolver.sol";

contract PublicResolverMock is PublicResolver {
    constructor(
        SidRegistry _sidRegistry,
        address _trustedController,
        uint chainType
    ) PublicResolver(_sidRegistry, _trustedController, chainType) {}
}
