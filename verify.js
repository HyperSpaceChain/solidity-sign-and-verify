const EthereumWallet = require('ethereumjs-wallet');
const Console = require('console');
const Web3 = require('web3');

const privateKey = '4735791f75e895710dea98efbe4b5ca86859de49e1c928097d3d00f7412a96e0';
const wallet = EthereumWallet.fromPrivateKey(Buffer.from(privateKey, 'Hex'));
Console.log('address: ' + wallet.getAddressString());
Console.log('privateKey: ' + wallet.getPrivateKeyString());
Console.log('publicKey: ' + wallet.getPublicKeyString());
Console.log('');

const web3 = new Web3();
const messagetoSign = web3.utils.sha3('message');
const signatureData = web3.eth.accounts.sign(messagetoSign, wallet.getPrivateKeyString());

const signature = signatureData.signature;
const v = signatureData.v;
const r = signatureData.r;
const s = signatureData.s;
Console.log('messagetoSign: ' + messagetoSign)
Console.log('signature: ' + signature)
Console.log('v: ' + v)
Console.log('r: ' + r)
Console.log('s: ' + s)