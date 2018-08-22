var etherWallet = require('ethereumjs-wallet');
var console = require('console');
var Web3 = require('web3');
 
var wallet1 = etherWallet.fromPrivateKey(Buffer.from('cc44f51a3935aa1d5c2f7b1cfc2b3d4903e57402413d1cb506a35a264bb8009f', 'Hex'));
console.log('address1: ' + wallet1.getAddressString());
console.log('private key1: ' + wallet1.getPrivateKeyString());
console.log('public key1: ' + wallet1.getPublicKeyString());
console.log('');
 
var web3 = new Web3();
const messagetoSign = web3.utils.sha3('personal identity information');
var signatureData = web3.eth.accounts.sign(messagetoSign, wallet1.getPrivateKeyString());
 
let signature = signatureData.signature;
let v = signatureData.v;
let r = signatureData.r;
let s = signatureData.s;
console.log('messagetoSign: ' + messagetoSign)       
console.log('signature: ' + signature)
console.log('v: ' + v)
console.log('r: ' + r)
console.log('s: ' + s)