const EthereumWallet = require('ethereumjs-wallet');
const Ecies = require('eth-ecies');

contract('TestEncrption', function (accounts) {
    it("Encription and decription test", async function () {
        const privateKey = 'cc44f51a3935aa1d5c2f7b1cfc2b3d4903e57402413d1cb506a35a264bb8009f';
        const wallet = EthereumWallet.fromPrivateKey(Buffer.from(privateKey, 'Hex'));
        console.log('address: ' + wallet.getAddressString());
        console.log('privateKey: ' + wallet.getPrivateKeyString());
        console.log('publicKey: ' + wallet.getPublicKeyString());
        console.log('');

        const message = 'message';

        // encryption
        const encryptedData = Ecies.encrypt(wallet.getPublicKey(), new Buffer(message));
        const encryptedMessage = encryptedData.toString('base64');

        // description
        const decryptedData = Ecies.decrypt(wallet.getPrivateKey(), new Buffer(encryptedMessage, 'base64'));
        const decryptedMessage = decryptedData.toString('utf8');

        console.log('message: ' + message);
        console.log('encripted message: ' + encryptedMessage);
        console.log('decrypted message: ' + decryptedMessage);
        assert.equal(message, decryptedMessage);
    })
})
