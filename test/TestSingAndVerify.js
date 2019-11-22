var Validator = artifacts.require("./Validator.sol");
var ethUtil = require('ethereumjs-util');


contract('Verify Test', function (accounts) {

    var validator;
    beforeEach(async function () {
        validator = await Validator.new({from: accounts[0]});
        // console.log('Ethereum Client: ' + web3.version.node);
    })

    it("Verify test: Signed messages should return signing address", async function () {
        const messagetoSign = web3.utils.keccak256('messageQQQ');
        //console.log("messagetoSign(web3.utils.sha3('message')):" + messagetoSign);

        const address = await accounts[0];
        //console.log("address(accounts[0]):" + address);

        var signature = await web3.eth.sign(messagetoSign, address);
        //console.log("signature(web3.eth.sign(messagetoSign, address)):" + signature);

        signatureData = ethUtil.fromRpcSig(signature);
        let v = ethUtil.bufferToHex(signatureData.v);
        let r = ethUtil.bufferToHex(signatureData.r);
        let s = ethUtil.bufferToHex(signatureData.s);

        let recoveredAddress = await validator.recoverAddress(messagetoSign, v, r, s, {from: accounts[0]});
        console.log('messagetoSign: ' + messagetoSign);
        console.log('signature: ' + signature);
        console.log('v: ' + v);
        console.log('r: ' + r);
        console.log('s: ' + s);
        console.log('address: ' + address + ', returned address: ' + recoveredAddress);
        await assert.equal(recoveredAddress, address);

        let isVerified = await validator.verify(address, messagetoSign, v, r, s, {from: accounts[0]});
        console.log('verification success?: ' + isVerified);

    })
})
