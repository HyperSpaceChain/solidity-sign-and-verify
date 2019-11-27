pragma solidity ^0.4.24;
 
contract Validator {
  function recoverAddress(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public constant returns(address) {
      bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, msgHash));
      return ecrecover(msgHash, v, r, s);
  }
  function verify(address addr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public constant returns(bool) {
      return addr == recoverAddress(msgHash, v, r, s);
  }
}