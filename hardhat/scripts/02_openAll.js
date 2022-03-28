const fs = require('fs')
const { ethers } = require('hardhat')
const address = require('./address')
const params = require('./params')
const { getWallets } = require('./utils/getWallets')
const { getContracts } = require('./utils/getContracts')

async function caller () {
  const [
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
    factory,
    marketPlace
  ] = await getContracts()

  await main(handler, nt, polarNode, polarLuckyBox, swapper, marketPlace)
}

async function main (handler, nt, polarNode, polarLuckyBox, swapper, marketPlace) {
  const [owner, metamask, payees, distri] = await getWallets()

  let res, estimatedGas, args

  console.log('-----OPEN ALL-----')

  args = [true, true, true, true, true]
  for (const n of nt) {
    const name = await n.name()
    console.log('\t' + name + ' Open')

    estimatedGas = await n.connect(owner).estimateGas.setOpenCreate(...args)
    res = await n.connect(owner).setOpenCreate(...args, {
      gasLimit: estimatedGas.toNumber() + 50000
    })
    await res.wait()
    console.log('\t\t' + name + '.setOpenCreate()')

    res = await n.openCreateNodesWithTokens()
    console.log('\t\t' + name + '.openCreateNodesWithTokens() =', res)
    res = await n.openCreateNodesLevelUp()
    console.log('\t\t' + name + '.openCreateNodesLevelUp() =', res)
    res = await n.openCreateNodesWithPending()
    console.log('\t\t' + name + '.openCreateNodesWithPending() =', res)
    res = await n.openCreateNodesWithLuckyBoxes()
    console.log('\t\t' + name + '.openCreateNodesWithLuckyBoxes() =', res)
    res = await n.openCreateNodesMigration()
    console.log('\t\t' + name + '.openCreateNodesMigration() =', res)
  }

  console.log('\tPolarLuckyBox Open')
  estimatedGas = await polarLuckyBox.connect(owner).estimateGas.setOpenCreate(true)
  res = await polarLuckyBox.connect(owner).setOpenCreate(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tpolarLuckyBoxes.setOpenCreate(true)')
  res = await polarLuckyBox.openCreateLuckyBoxesWithTokens()
  console.log('\t\tpolarLuckyBoxes.openCreateLuckyBoxesWithTokens() =', res)

  console.log('\tPolarNode Open')
  estimatedGas = await polarNode.connect(owner).estimateGas.setOpenCreateNft(true)
  res = await polarNode.connect(owner).setOpenCreateNft(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tpolarNode.setOpenCreateNft(true)')
  res = await polarNode.openCreateNft()
  console.log('\t\tpolarNode.openCreateNft() =', res)

  console.log('\tSwapper Open')
  estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapCreateNodesWithTokens(true)
  res = await swapper.connect(owner).setOpenSwapCreateNodesWithTokens(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tswapper.setOpenSwapCreateNodesWithTokens(true)')
  res = await swapper.openSwapCreateNodesWithTokens()
  console.log('\t\tswapper.openSwapCreateNodesWithTokens() =', res)

  estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapCreateNodesWithPending(true)
  res = await swapper.connect(owner).setOpenSwapCreateNodesWithPending(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tswapper.setOpenSwapCreateNodesWithPending(true)')
  res = await swapper.openSwapCreateNodesWithPending()
  console.log('\t\tswapper.openSwapCreateNodesWithPending() =', res)

  estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapCreateLuckyBoxesWithTokens(true)
  res = await swapper.connect(owner).setOpenSwapCreateLuckyBoxesWithTokens(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tswapper.setOpenSwapCreateLuckyBoxesWithTokens(true)')
  res = await swapper.openSwapCreateLuckyBoxesWithTokens()
  console.log('\t\tswapper.openSwapCreateLuckyBoxesWithTokens() =', res)

  estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapClaimRewardsAll(true)
  res = await swapper.connect(owner).setOpenSwapClaimRewardsAll(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tswapper.setOpenSwapClaimRewardsAll(true)')
  res = await swapper.openSwapClaimRewardsAll()
  console.log('\t\tswapper.openSwapClaimRewardsAll() =', res)

  estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapClaimRewardsBatch(true)
  res = await swapper.connect(owner).setOpenSwapClaimRewardsBatch(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tswapper.setOpenSwapClaimRewardsBatch(true)')
  res = await swapper.openSwapClaimRewardsBatch()
  console.log('\t\tswapper.openSwapClaimRewardsBatch() =', res)

  estimatedGas = await swapper.connect(owner).estimateGas.setOpenSwapClaimRewardsNodeType(true)
  res = await swapper.connect(owner).setOpenSwapClaimRewardsNodeType(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tswapper.setOpenSwapClaimRewardsNodeType(true)')
  res = await swapper.openSwapClaimRewardsNodeType()
  console.log('\t\tswapper.openSwapClaimRewardsNodeType() =', res)

  console.log('\tPolarMarketPlace Open')
  estimatedGas = await marketPlace.connect(owner).estimateGas.setOpenOffer(true)
  res = await marketPlace.connect(owner).setOpenOffer(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tmarketPlace.setOpenOffer(true)')
  res = await marketPlace.openOffer()
  console.log('\t\tmarketPlace.openOffer() =', res)

  estimatedGas = await marketPlace.connect(owner).estimateGas.setOpenAuction(true)
  res = await marketPlace.connect(owner).setOpenAuction(true,
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('\t\tmarketPlace.setOpenAuction(true)')
  res = await marketPlace.openAuction()
  console.log('\t\tmarketPlace.openAuction() =', res)

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
