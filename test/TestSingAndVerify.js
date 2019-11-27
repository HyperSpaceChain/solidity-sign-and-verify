var Validator = artifacts.require("./Validator.sol");
var ethUtil = require('ethereumjs-util');
var EthereumWallet = require('ethereumjs-wallet');
var Ecies = require('eth-ecies');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

contract('Validator', function (accounts) {
    var validator;
    beforeEach(async function () {
        validator = await Validator.new({from: accounts[3]});
        console.log('Ethereum Client: ' + web3.version.node);
        //console.log('Contract Creator: '+ {from: accounts[3]});
    })

    it('ECDSA test', async function () {
    // Manually enter the privateKey and the message string to sign.

        const privateKey = 'd065755e793d190030fe3e2ffc18a3fe3e0f220be456300dda22846c987bd896';
        const message = 'Somsdfsdfsdfsdfsddg22fhdfghfdghdfghdfghdfghdfghdfghdfghdfghfghdfghfde Data';
        const wallet = EthereumWallet.fromPrivateKey(Buffer.from(privateKey, 'Hex'));

    // Manully enter the account number
        let accounts = await web3.eth.getAccounts();
        const direct_get_address = accounts[9];
        const privateKey_convert_address = wallet.getAddressString();

    // Output privateKey => publicKey => address
        console.log('privateKey => publicKey => address');
        console.log('privateKey: ' + wallet.getPrivateKeyString());
        console.log('publicKey: ' + wallet.getPublicKeyString());
        console.log('address: ' + wallet.getAddressString());
        console.log('Direct get address: ' + direct_get_address);
        //assert.equal(wallet.getAddressString(), direct_get_address);
        console.log('');

    // Elliptic Curve Intergrated Encryption Scheme(ECIES) TEST - refer to https://www.npmjs.com/package/ecies 
        const encryptedData = Ecies.encrypt(wallet.getPublicKey(), new Buffer(message));
        const encryptedMessage = encryptedData.toString('base64');
        const decryptedData = Ecies.decrypt(wallet.getPrivateKey(), new Buffer(encryptedMessage, 'base64'));
        const decryptedMessage = decryptedData.toString('utf8');

        console.log('Elliptic Curve Intergrated Encryption Scheme(ECIES) TEST');
        console.log('message: ' + message);
        console.log('encripted message: ' + encryptedMessage);
        console.log('decrypted message: ' + decryptedMessage);
        assert.equal(message, decryptedMessage);
        console.log('');

    // cacultate message hash
        const prefix = "\x19Ethereum Signed Message:\n" + message.length;
        const messageHash = web3.utils.keccak256(prefix+message);
        console.log('message length: '+ message.length);
        console.log('message hash(prefix included- prefix+message ): ' + messageHash);
        console.log('');

    // Using eth.sign() ECDSA
        let signature_eth_sign = await web3.eth.sign(messageHash, direct_get_address);
        signature_eth_sign_Data = ethUtil.fromRpcSig(signature_eth_sign);
        let signature_eth_sign_DataV = ethUtil.bufferToHex(signature_eth_sign_Data.v);
        let signature_eth_sign_DataR = ethUtil.bufferToHex(signature_eth_sign_Data.r);
        let signature_eth_sign_DataS = ethUtil.bufferToHex(signature_eth_sign_Data.s);
        console.log('(Address_based) - web3.eth.sign')
        console.log('signature: ' + signature_eth_sign);
        // console.log('signature_eth_sign_Data: ' + JSON.stringify(signature_eth_sign_Data));
        console.log('signarure.message: '+ message);
        console.log('signarure.messageHash: '+ messageHash);
        console.log('signature.v: ' + signature_eth_sign_DataV);
        console.log('signature.r: ' + signature_eth_sign_DataR);
        console.log('signature.s: ' + signature_eth_sign_DataS); 
        console.log('');

        const ecRecover_eth_sign = await web3.eth.accounts.recover(messageHash, signature_eth_sign);
        const ecRecover_solidity_directAddress = await validator.recoverAddress(messageHash, signature_eth_sign_DataV, signature_eth_sign_DataR, signature_eth_sign_DataS);
        console.log('original Address    : ' + direct_get_address);
        console.log('ecRecover     (web3): ' + ecRecover_eth_sign);
        console.log('ecRecover     (web3): ' + ecRecover_solidity_directAddress); // This line use in the solidity ver 0.4.24
        // console.log('ecrecover (solidity): ' + ecRecover_solidity_directAddress.receipt.from); // This line use in the solidity ver 0.5.12
        let isVerified = await validator.verify(direct_get_address, messageHash, signature_eth_sign_DataV, signature_eth_sign_DataR, signature_eth_sign_DataS);
        console.log('Verification result : ' + JSON.stringify(isVerified));
        console.log('');


    // Using eth.accounts.sign() - returns an object
        const signature_eth_accounts_sign = await web3.eth.accounts.sign(message, '0x'+privateKey);
        // console.log('Full signature object(privateKey base: ' + JSON.stringify(signature_eth_sign_Data, null, 4));
        console.log('(PrivateKey_based) - web3.eth.accounts.sign');
        console.log('signarure: '+ signature_eth_accounts_sign.signature);
        console.log('signarure.message: '+ signature_eth_accounts_sign.message);
        console.log('signarure.messageHash: '+ signature_eth_accounts_sign.messageHash);
        console.log('signature.v: '+ signature_eth_accounts_sign.v);
        console.log('signature.r: '+ signature_eth_accounts_sign.r);
        console.log('signature.s: '+ signature_eth_accounts_sign.s);
        console.log('');

        const ecRecover_eth_accounts_sign = await web3.eth.accounts.recover(signature_eth_accounts_sign);
        const ecRecover_solidity_privateKey = await validator.recoverAddress(messageHash, signature_eth_accounts_sign.v, signature_eth_accounts_sign.r, signature_eth_accounts_sign.s); // returns object value
        console.log('original Address    : ' + privateKey_convert_address);
        console.log('ecRecover     (web3): ' + ecRecover_eth_accounts_sign);
        console.log('ecrecover (solidity): ' + ecRecover_solidity_privateKey); // This line use in the solidity ver 0.4.24
        // console.log('ecrecover (solidity): ' + ecRecover_solidity_privateKey.receipt.from); // This line use in the solidity ver 0.5.12
        let isVerified2 = await validator.verify(privateKey_convert_address, signature_eth_accounts_sign.messageHash, signature_eth_accounts_sign.v, signature_eth_accounts_sign.r, signature_eth_accounts_sign.s);
        console.log('Verification result : ' + JSON.stringify(isVerified2));
    })
})
