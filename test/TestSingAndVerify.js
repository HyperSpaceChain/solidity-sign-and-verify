var Validator = artifacts.require("./Validator.sol");
var ethUtil = require('ethereumjs-util');


contract('Verify Test', function (accounts) {

    var validator;
    beforeEach(async function () {
        validator = await Validator.new({from: accounts[9]});
        // console.log('Ethereum Client: ' + web3.version.node);
    })

    it("Verify test: Signed messages should return signing address", async function () {
        const messageHash = web3.utils.keccak256('Test_commit');
        //console.log("messageHash(web3.utils.sha3('message')):" + messageHash);

        const fakeAddress = await accounts[5];
        const address = await accounts[1];
        //console.log("address(accounts[0]):" + address);

        var signature = await web3.eth.sign(messageHash, address);
        //console.log("signature(web3.eth.sign(messageHash, address)):" + signature);

        signatureData = ethUtil.fromRpcSig(signature);
        let v = ethUtil.bufferToHex(signatureData.v);
        let r = ethUtil.bufferToHex(signatureData.r);
        let s = ethUtil.bufferToHex(signatureData.s);

        let recoveredAddress = await validator.recoverAddress(messageHash, v, r, s);
        console.log('messageHash: ' + messageHash);
        console.log('signature: ' + signature);
        console.log('v: ' + v);
        console.log('r: ' + r);
        console.log('s: ' + s);
        console.log('address: ' + address + ', returned address: ' + recoveredAddress);
        await assert.equal(recoveredAddress, address);

        let isVerified = await validator.verify(address, messageHash, v, r, s);
        let isVerifiedFake = await validator.verify(fakeAddress, messageHash, v, r, s);
        console.log('Normal - verification success : ' + isVerified);
        console.log('Fake   - verification success : ' + isVerifiedFake);

    })
})
