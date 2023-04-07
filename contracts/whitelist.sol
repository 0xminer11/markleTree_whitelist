// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract WhitelistedUser is Initializable {
    bytes32 private rootHash;
    address private admin;

    modifier OnlyAdmin() {
        require(msg.sender == admin, "Unauthorised call");
        _;
    }

    modifier _whitelistuser(bytes32[] memory _proof, bytes32 _leaf){
        require(verify(_proof,_leaf),"Not WhitelistedUser");
        _;
    }
    
    constructor(){
        admin = msg.sender;
    }

    function setrootHash(bytes32 rootHashValue) external returns(bool){
        rootHash = rootHashValue;
        return(true);
    }

    function getAdmin() external view returns (address) {
        return admin;
    }

    function getRootHash() external view returns (bytes32) {
        return rootHash;
    }

    function verify(bytes32[] memory proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        return processProof(proof,leaf);
    }

    function processProof(bytes32[] memory proof, bytes32 leaf)
        internal
        view
        returns (bool)
    {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return(computedHash == rootHash);
    }

    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? _efficientHash(a, b) : _efficientHash(b, a);
    }

    function _efficientHash(bytes32 a, bytes32 b)
        private
        pure
        returns (bytes32 value)
    {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }
}