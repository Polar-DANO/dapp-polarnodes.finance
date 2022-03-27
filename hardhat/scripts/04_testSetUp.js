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

  const addOwner = require('./03_addOwner')
  await addOwner(handler, nt, polarNode, polarLuckyBox, swapper, marketPlace)

  const { getContracts } = require('./utils/getContracts')
  const [,,,,,, router,, wavax] = await getContracts()

  await main(handler, nt, polarNode, polarLuckyBox, swapper, polar, router, dai, wavax)
}

async function main (handler, nt, polarNode, polarLuckyBox, swapper, polar, router, dai, wavax) {
  const [owner, metamask, payees, distri] = await getWallets()

  let res, estimatedGas, args

  console.log('-----TEST SETUP-----')

  for (const addr of [
    address.Distri,
    address.Metamask
  ]) {
    estimatedGas = await polar.connect(owner).estimateGas
      .mint(ethers.utils.parseUnits('1000000', 18), addr)
    res = await polar.connect(owner).mint(ethers.utils.parseUnits('1000000', 18), addr, {
      gasLimit: estimatedGas.toNumber() + 50000
    })
    await res.wait()
    console.log('polar.mint(1000000,' + addr + ')')

    estimatedGas = await dai.connect(owner).estimateGas
      .mint(ethers.utils.parseUnits('1000000', 18), addr)
    res = await dai.connect(owner).mint(ethers.utils.parseUnits('1000000', 18), addr, {
      gasLimit: estimatedGas.toNumber() + 50000
    })
    await res.wait()
    console.log('dai.mint(1000000,' + addr + ')')
  }

  // TO REMOVE
  estimatedGas = await polar.connect(owner).estimateGas
    .mint(ethers.utils.parseUnits('1000000', 18), owner.address)
  res = await polar.connect(owner).mint(ethers.utils.parseUnits('1000000', 18), owner.address, {
    gasLimit: estimatedGas.toNumber() + 50000
  })
  await res.wait()
  console.log('polar.mint(1000000,' + owner.address + ')')

  estimatedGas = await polar.connect(distri).estimateGas.approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  )
  res = await polar.connect(distri).approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('polar.connect(distri).approve(swapper)')

  estimatedGas = await dai.connect(distri).estimateGas.approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  )
  res = await dai.connect(distri).approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('dai.connect(distri).approve(swapper)')

  estimatedGas = await wavax.connect(distri).estimateGas.approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  )
  res = await wavax.connect(distri).approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('wavax.connect(distri).approve(swapper)')

  estimatedGas = await polar.connect(metamask).estimateGas.approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  )
  res = await polar.connect(metamask).approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('polar.connect(metamask).approve(swapper)')

  estimatedGas = await dai.connect(metamask).estimateGas.approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  )
  res = await dai.connect(metamask).approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('dai.connect(metamask).approve(swapper)')

  estimatedGas = await wavax.connect(metamask).estimateGas.approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  )
  res = await wavax.connect(metamask).approve(
    swapper.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    { gasLimit: estimatedGas.toNumber() + 50000 }
  )
  await res.wait()
  console.log('wavax.connect(metamask).approve(swapper)')

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
