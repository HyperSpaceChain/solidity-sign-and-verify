var Verify = artifacts.require("./Verify.sol")
var ethUtil = require('ethereumjs-util')
 
contract('Verify Test', function(accounts) {
 
  beforeEach(async function() {
    this.contract = await Verify.new()
    console.log('Ethereum Client: ' + web3.version.node)
  })
 
  it("Verify test: Signed messages should return signing address", async function() {
    const messagetoSign = web3.sha3('personal identity information')
 
    const address = accounts[0]                   
    var signature = await web3.eth.sign(address, messagetoSign)
 
    signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)
     
    const recoveredAddress = await this.contract.recoverAddress(messagetoSign, v, r, s)
    console.log('messagetoSign: ' + messagetoSign)       
    console.log('signature: ' + signature)
    console.log('v: ' + v)
    console.log('r: ' + r)
    console.log('s: ' + s)
    console.log('address: ' + address + ', returned address: ' + recoveredAddress)
    assert.equal(recoveredAddress, address)

    const isVerified = await this.contract.verify(address, messagetoSign, v, r, s)
    console.log('verification success?: ' + isVerified)
 
  })
})
