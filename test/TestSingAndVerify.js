var Validator = artifacts.require("./Validator.sol");
var ethUtil = require('ethereumjs-util');


contract('Verify Test', function (accounts) {

    var validator;
    beforeEach(async function () {
        validator = await Validator.new({from: accounts[0]});
        // console.log('Ethereum Client: ' + web3.version.node);
    })

    it("Verify test: Signed messages should return signing address", async function () {
        const messageHash = web3.utils.keccak256('mesjkl,hjk,hsageQfghbcghfgjnhfghjmghfjmgffhjnftyjtbhjgvhfjnfbjfghjbfgbjhfgbhjQQ');
        //console.log("messageHash(web3.utils.sha3('message')):" + messageHash);

        const address = await accounts[0];
        //console.log("address(accounts[0]):" + address);

        var signature = await web3.eth.sign(messageHash, address);
        //console.log("signature(web3.eth.sign(messageHash, address)):" + signature);

        signatureData = ethUtil.fromRpcSig(signature);
        let v = ethUtil.bufferToHex(signatureData.v);
        let r = ethUtil.bufferToHex(signatureData.r);
        let s = ethUtil.bufferToHex(signatureData.s);

        let recoveredAddress = await validator.recoverAddress(messageHash, v, r, s, {from: accounts[0]});
        console.log('messageHash: ' + messageHash);
        console.log('signature: ' + signature);
        console.log('v: ' + v);
        console.log('r: ' + r);
        console.log('s: ' + s);
        console.log('address: ' + address + ', returned address: ' + recoveredAddress);
        await assert.equal(recoveredAddress, address);

        let isVerified = await validator.verify(address, messageHash, v, r, s, {from: accounts[0]});
        console.log('verification success?: ' + isVerified);

    })
})
