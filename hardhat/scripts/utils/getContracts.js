const fs = require('fs/promises')
const { ethers } = require('hardhat')
const address = require('../address')

async function getContracts () {
  let rawJson

  const nt = []

  rawJson = await fs.readFile('./abi/contracts/Handler.sol/Handler.json')
  const abiHandler = JSON.parse(rawJson)
  handler = new ethers.Contract(address.Handler, abiHandler, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/NodeType.sol/NodeType.json')
  const abiNt = JSON.parse(rawJson)
  nt.push(new ethers.Contract(address.NodeType0, abiNt, ethers.provider))
  nt.push(new ethers.Contract(address.NodeType1, abiNt, ethers.provider))
  nt.push(new ethers.Contract(address.NodeType2, abiNt, ethers.provider))
  nt.push(new ethers.Contract(address.NodeType3, abiNt, ethers.provider))
  nt.push(new ethers.Contract(address.NodeType4, abiNt, ethers.provider))

  rawJson = await fs.readFile('./abi/contracts/PolarNode.sol/PolarNode.json')
  const abiPolarNode = JSON.parse(rawJson)
  polarNode = new ethers.Contract(address.PolarNode, abiPolarNode, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/PolarLuckyBox.sol/PolarLuckyBox.json')
  const abiPolarLuckyBox = JSON.parse(rawJson)
  polarLuckyBox = new ethers.Contract(address.PolarLuckyBox, abiPolarLuckyBox, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/Swapper.sol/Swapper.json')
  const abiSwapper = JSON.parse(rawJson)
  swapper = new ethers.Contract(address.Swapper, abiSwapper, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/Polar.sol/Polar.json')
  const abiPolar = JSON.parse(rawJson)
  const polar = new ethers.Contract(address.Token, abiPolar, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/IJoeRouter02.sol/IJoeRouter02.json')
  const abiRouter = JSON.parse(rawJson)
  const router = new ethers.Contract(address.Router, abiRouter, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/MDAI.sol/MDAI.json')
  const abiDai = JSON.parse(rawJson)
  const dai = new ethers.Contract(address.Dai, abiDai, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/Wavax.sol/WAVAX.json')
  const abiWavax = JSON.parse(rawJson)
  const wavax = new ethers.Contract(address.Native, abiWavax, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/NODERewardManager.sol/NODERewardManager.json')
  const abiOld = JSON.parse(rawJson)
  const old = new ethers.Contract(address.Old, abiOld, ethers.provider)

  rawJson = await fs.readFile('./abi/contracts/Factory.sol/JoeFactory.json')
  const abiFactory = JSON.parse(rawJson)
  const factory = new ethers.Contract(address.Factory, abiFactory, ethers.provider)

  return [
    handler,
    nt,
    polarNode,
    polarLuckyBox,
    swapper,
    polar,
    router,
    dai,
    wavax,
    old,
    factory
  ]
}

module.exports = {
  getContracts
}
