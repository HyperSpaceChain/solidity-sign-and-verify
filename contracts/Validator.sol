pragma solidity ^0.4.23;
 
contract Validator {
  function recoverAddress(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public constant returns(address) {
      bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      bytes32 prefixedHash = keccak256(prefix, msgHash);
      return ecrecover(prefixedHash, v, r, s);
  }
  function verify(address addr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public constant returns(bool) {
      return addr == recoverAddress(msgHash, v, r, s);
  }
}