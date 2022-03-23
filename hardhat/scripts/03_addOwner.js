const fs = require('fs')
const { ethers } = require('hardhat')
const address = require('./address')
const params = require('./params')
const { getWallets } = require('./utils/getWallets')

async function caller () {
  await require('./00_earlySetUp')()
  const deploy = require('./00_deploy')
  const [
    handler,
    nt,
    polarNode,
    polarLuckyBox,
    swapper,
    polar,
    dai,
    marketPlace
  ] = await deploy()

  const setUp = require('./01_setUp')
  await setUp(handler, nt, polarNode, polarLuckyBox, swapper, marketPlace)

  const openAll = require('./02_openAll')
  await openAll(handler, nt, polarNode, polarLuckyBox, swapper, marketPlace)

  await main(handler, nt, polarNode, polarLuckyBox, swapper, marketPlace)
}

async function main (handler, nt, polarNode, polarLuckyBox, swapper, marketPlace) {
  const [owner, metamask, payees, distri] = await getWallets()

  let res, estimatedGas, args

  console.log('-----ADD OWNER-----')

  console.log('\tHandler Owners')
  estimatedGas = await handler.connect(owner).estimateGas.addOwner(...params.AddOwner)
  res = await handler.connect(owner).addOwner(...params.AddOwner,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\thandler.addOwner(' + params.AddOwner + ')')
  res = await handler.isOwner(params.AddOwner[0])
  console.log('\t\thandler.isOwner(' + params.AddOwner + ') =', res)

  console.log('\tPolarNode Owners')
  estimatedGas = await polarNode.connect(owner).estimateGas.addOwner(...params.AddOwner)
  res = await polarNode.connect(owner).addOwner(...params.AddOwner,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tpolarNode.addOwner(' + params.AddOwner + ')')
  res = await polarNode.isOwner(params.AddOwner[0])
  console.log('\t\tpolarNode.isOwner(' + params.AddOwner + ') =', res)

  console.log('\tPolarLuckyBox Owners')
  estimatedGas = await polarLuckyBox.connect(owner).estimateGas.addOwner(...params.AddOwner)
  res = await polarLuckyBox.connect(owner).addOwner(...params.AddOwner,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tpolarLuckyBox.addOwner(' + params.AddOwner + ')')
  res = await polarLuckyBox.isOwner(params.AddOwner[0])
  console.log('\t\tpolarLuckyBox.isOwner(' + params.AddOwner + ') =', res)

  console.log('\tSwapper Owners')
  estimatedGas = await swapper.connect(owner).estimateGas.addOwner(...params.AddOwner)
  res = await swapper.connect(owner).addOwner(...params.AddOwner,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tswapper.addOwner(' + params.AddOwner + ')')
  res = await swapper.isOwner(params.AddOwner[0])
  console.log('\t\tswapper.isOwner(' + params.AddOwner + ') =', res)

  for (const n of nt) {
    const name = await n.name()
    console.log('\t' + name + ' Owners')
    estimatedGas = await n.connect(owner).estimateGas.addOwner(...params.AddOwner)
    res = await n.connect(owner).addOwner(...params.AddOwner,
      { gasLimit: estimatedGas.toNumber() + 50000 }
    )
    await res.wait()
    console.log('\t\t' + name + '.addOwner(' + params.AddOwner + ')')
    res = await n.isOwner(params.AddOwner[0])
    console.log('\t\t' + name + '.isOwner(' + params.AddOwner + ') =', res)
  }

  // add market place owners
  console.log('\tPolarMarketPlace Owners')
  estimatedGas = await marketPlace.connect(owner).estimateGas.addOwner(...params.AddOwner)
  res = await marketPlace.connect(owner).addOwner(...params.AddOwner,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tmarketPlace.addOwner(' + params.AddOwner + ')')
  res = await marketPlace.isOwner(params.AddOwner[0])
  console.log('\t\tmarketPlace.isOwner(' + params.AddOwner + ') =', res)

  console.log()
}

if (require.main === module) {
  caller()
    .then(_ => process.exit())
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}

module.exports = main
