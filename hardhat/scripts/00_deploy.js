const fs = require('fs')
const { ethers } = require('hardhat')
const address = require('./address')
const params = require('./params')
const { getWallets } = require('./utils/getWallets')
const { getContracts } = require('./utils/getContracts')
const earlySetUp = require('./00_earlySetUp')

async function replaceInFile (searchPattern, newLine, filePath) {
  return new Promise((resolve, error) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
      const formatted = data.replace(searchPattern, newLine)
      fs.writeFile(filePath, formatted, function (err) {
        if (err) { console.log(err) }
        resolve()
      })
    })
  })
}

async function main () {
  const [owner, metamask, payees, distri] = await getWallets()
  const [
    ,,,,,
    polar,
    router,
    dai,
    wavax,
    old,
    factory
  ] = await getContracts()

  let str

  console.log('-----DEPLOY-----')

  const Handler = await ethers.getContractFactory('Handler')
  const handler = await Handler.connect(owner).deploy()
  str = 'const Handler = "' + handler.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const Handler(.*);/g, str, './scripts/address.js')
  await handler.deployed()

  const NodeType0 = await ethers.getContractFactory('NodeType')
  const nodeType0 = await NodeType0.connect(owner).deploy(
    params.NodeType0.name,
    params.NodeType0.values,
    handler.address,
    address.Old
  )
  str = 'const NodeType0 = "' + nodeType0.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const NodeType0(.*);/g, str, './scripts/address.js')
  await nodeType0.deployed()

  const NodeType1 = await ethers.getContractFactory('NodeType')
  const nodeType1 = await NodeType1.connect(owner).deploy(
    params.NodeType1.name,
    params.NodeType1.values,
    handler.address,
    address.Old
  )
  str = 'const NodeType1 = "' + nodeType1.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const NodeType1(.*);/g, str, './scripts/address.js')
  await nodeType1.deployed()

  const NodeType2 = await ethers.getContractFactory('NodeType')
  const nodeType2 = await NodeType2.connect(owner).deploy(
    params.NodeType2.name,
    params.NodeType2.values,
    handler.address,
    address.Old
  )
  str = 'const NodeType2 = "' + nodeType2.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const NodeType2(.*);/g, str, './scripts/address.js')
  await nodeType2.deployed()

  const NodeType3 = await ethers.getContractFactory('NodeType')
  const nodeType3 = await NodeType3.connect(owner).deploy(
    params.NodeType3.name,
    params.NodeType3.values,
    handler.address,
    address.Old
  )
  str = 'const NodeType3 = "' + nodeType3.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const NodeType3(.*);/g, str, './scripts/address.js')
  await nodeType3.deployed()

  const NodeType4 = await ethers.getContractFactory('NodeType')
  const nodeType4 = await NodeType4.connect(owner).deploy(
    params.NodeType4.name,
    params.NodeType4.values,
    handler.address,
    address.Old
  )
  str = 'const NodeType4 = "' + nodeType4.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const NodeType4(.*);/g, str, './scripts/address.js')
  await nodeType4.deployed()

  const PolarNode = await ethers.getContractFactory('PolarNode')
  const polarNode = await PolarNode.connect(owner).deploy(
    params.PolarNode.baseUri,
    handler.address
  )
  str = 'const PolarNode = "' + polarNode.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const PolarNode(.*);/g, str, './scripts/address.js')
  await polarNode.deployed()

  const PolarLuckyBox = await ethers.getContractFactory('PolarLuckyBox')
  const polarLuckyBox = await PolarLuckyBox.connect(owner).deploy(
    params.PolarLuckyBox.baseUri,
    handler.address
  )
  str = 'const PolarLuckyBox = "' + polarLuckyBox.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const PolarLuckyBox(.*);/g, str, './scripts/address.js')
  await polarLuckyBox.deployed()

  const Swapper = await ethers.getContractFactory('Swapper')
  const swapper = await Swapper.connect(owner).deploy(
    params.Swapper.payees,
    params.Swapper.shares,
    params.Swapper.addresses,
    params.Swapper.fees,
    params.Swapper.swapTokensAmounts,
    handler.address
  )
  str = 'const Swapper = "' + swapper.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const Swapper(.*);/g, str, './scripts/address.js')
  await swapper.deployed()

  const MarketPlace = await ethers.getContractFactory('PolarMarketPlace')
  const marketPlace = await MarketPlace.connect(owner).deploy(
    polar.address, swapper.address, 1000
  )
  str = 'const MarketPlace = "' + marketPlace.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const MarketPlace(.*);/g, str, './scripts/address.js')
  await marketPlace.deployed()

  console.log()

  return Promise.resolve([
    handler, [
      nodeType0,
      nodeType1,
      nodeType2,
      nodeType3,
      nodeType4
    ],
    polarNode,
    polarLuckyBox,
    swapper,
    polar,
    dai,
    marketPlace
  ])
}

if (require.main === module) {
  main()
    .then(_ => process.exit())
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}

module.exports = main
