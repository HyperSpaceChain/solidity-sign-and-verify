const EthereumWallet = require('ethereumjs-wallet');
const Ecies = require('eth-ecies');

contract('TestEncrption', function (accounts) {
    it("Encription and decription test", async function () {
        const privateKey = '77486819ac75e8cd4de24c7e07fb35b380958a12e6bcd7ab8e75a268c9dd448b';
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
