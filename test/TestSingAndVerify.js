var Validator = artifacts.require("./Validator.sol");
var ethUtil = require('ethereumjs-util');

contract('Verify Test', function (accounts) {

    var validator;
    beforeEach(async function () {
        validator = await Validator.new({from: accounts[0]});
        console.log('Ethereum Client: ' + web3.version.node);
    })

    it("Verify test: Signed messages should return signing address", async function () {
        const messagetoSign = web3.sha3('message');

        const address = accounts[1];
        var signature = web3.eth.sign(address, messagetoSign);

        signatureData = ethUtil.fromRpcSig(signature);
        let v = ethUtil.bufferToHex(signatureData.v);
        let r = ethUtil.bufferToHex(signatureData.r);
        let s = ethUtil.bufferToHex(signatureData.s);

        const recoveredAddress = await validator.recoverAddress(messagetoSign, v, r, s, {from: accounts[0]});
        console.log('messagetoSign: ' + messagetoSign);
        console.log('signature: ' + signature);
        console.log('v: ' + v);
        console.log('r: ' + r);
        console.log('s: ' + s);
        console.log('address: ' + address + ', returned address: ' + recoveredAddress);
        assert.equal(recoveredAddress, address);

        const isVerified = await validator.verify(address, messagetoSign, v, r, s, {from: accounts[0]});
        console.log('verification success?: ' + isVerified);

    })
})
