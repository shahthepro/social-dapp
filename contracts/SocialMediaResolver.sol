pragma solidity ^0.5.0;

import "./ERC1484/interfaces/IdentityRegistryInterface.sol";
import "./ERC1484/SignatureVerifier.sol";

contract SocialMediaResolver is SignatureVerifier {
    mapping(uint => string) internal googleAccounts;

    IdentityRegistryInterface identityRegistry;
    address public signingAuthority;

    constructor (address identityRegistryAddress, address _signingAuthority) public {
        identityRegistry = IdentityRegistryInterface(identityRegistryAddress);
        signingAuthority = _signingAuthority;
    }

    function setGoogleAccount(string memory accountId, bytes memory sign) public {
        bytes32 msgHash = keccak256(abi.encodePacked("GOOGLE", msg.sender, accountId));

        require(isSignedByAuthority(msgHash, sign), "Message should be signed by authority.");

        uint ein = identityRegistry.getEIN(msg.sender);
        require(
            identityRegistry.isResolverFor(ein, address(this)), "The calling identity does not have this resolver set."
        );
        googleAccounts[ein] = accountId;
    }

    function getGoogleAccount(uint ein) public view returns(string memory) {
        require(identityRegistry.identityExists(ein), "The referenced identity does not exist.");
        return googleAccounts[ein];
    }

    function isSignedByAuthority(bytes32 msgHash, bytes memory sign) internal view returns(bool) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        (r, s, v) = extractRSV(sign);
    
        return isSigned(signingAuthority, msgHash, v, r, s);
    }

    function extractRSV(bytes memory sign) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        assembly {
            r := mload(add(sign, 32))
            s := mload(add(sign, 64))
            v := and(mload(add(sign, 65)), 255)
        }

        if (v < 27) {
            v += 27;
        }
    }
}
