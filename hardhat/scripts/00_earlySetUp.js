const fs = require('fs')
const { ethers } = require('hardhat')
const address = require('./address')
const params = require('./params')
const { getWallets } = require('./utils/getWallets')
const { getContracts } = require('./utils/getContracts')

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
  const [,,,,,, router,, wavax,, factory] = await getContracts()

  let res, estimatedGas, args, str, b1, b2

  console.log('-----EARLY SET UP-----')

  const Polar = await ethers.getContractFactory('Polar')
  const polar = await Polar.connect(owner).deploy()
  str = 'const Token = "' + polar.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const Token(.*);/g, str, './scripts/address.js')
  await polar.deployed()

  const Dai = await ethers.getContractFactory('MDAI')
  const dai = await Dai.connect(owner).deploy()
  str = 'const Dai = "' + dai.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const Dai(.*);/g, str, './scripts/address.js')
  await dai.deployed()

  const Old = await ethers.getContractFactory('Old')
  const old = await Old.connect(owner).deploy(metamask.address)
  str = 'const Old = "' + old.address + '";'
  console.log('\t' + str)
  await replaceInFile(/const Old(.*);/g, str, './scripts/address.js')
  await old.deployed()

  console.log()

  estimatedGas = await polar.connect(owner).estimateGas
    .mint(ethers.utils.parseUnits('1000000', 18), owner.address)
  res = await polar.connect(owner).mint(ethers.utils.parseUnits('1000000', 18), owner.address, {
    gasLimit: estimatedGas.toNumber() + 50000
  })
  await res.wait()
  console.log('polar.mint(1000000,owner)')
  b1 = ethers.utils.parseUnits('900', 18) // avax
  b2 = ethers.utils.parseUnits('1000000', 18) // polar
  estimatedGas = await polar.connect(owner).estimateGas.approve(router.address, b2)
  res = await polar.connect(owner).approve(router.address, b2, { gasLimit: estimatedGas.toNumber() + 50000 })
  await res.wait()
  console.log('polar.approve(router,1000000)')
  await Promise.all(
    payees.map(async (payee) => {
      const res = await polar.connect(payee).getToken()
      await res.wait()
      console.log('polar.getToken() for ' + payee.address)
    })
  )
  let date = new Date()
  let deadline = Math.floor(date.getTime() / 1000) + 1000000000
  args = [
    polar.address,
    b2, b2, b1,
    owner.address, deadline
  ]
  estimatedGas = await router.connect(owner).estimateGas
    .addLiquidityAVAX(...args, { value: b1 })
  res = await router.connect(owner).addLiquidityAVAX(...args,
    { gasLimit: estimatedGas.toNumber() + 50000, value: b1 })
  await res.wait()
  console.log('router.addLiquidityAVAX(1000000polar,900avax)')
  res = await factory.getPair(polar.address, address.Native)
  const addressPair = res
  str = 'const Pair = "' + res + '";'
  console.log('\t' + str)
  await replaceInFile(/const Pair(.*);/g, str, './scripts/address.js')

  estimatedGas = await dai.connect(owner).estimateGas
    .mint(ethers.utils.parseUnits('1000000', 18), owner.address)
  res = await dai.connect(owner).mint(ethers.utils.parseUnits('1000000', 18), owner.address, {
    gasLimit: estimatedGas.toNumber() + 50000
  })
  await res.wait()
  console.log('dai.mint(1000000,owner)')
  b1 = ethers.utils.parseUnits('900', 18) // avax
  b2 = ethers.utils.parseUnits('1000000', 18) // dair
  estimatedGas = await dai.connect(owner).estimateGas.approve(router.address, b2)
  res = await dai.connect(owner).approve(router.address, b2, { gasLimit: estimatedGas.toNumber() + 50000 })
  await res.wait()
  console.log('dai.approve(router,1000000)')
  date = new Date()
  deadline = Math.floor(date.getTime() / 1000) + 1000000000
  args = [
    dai.address,
    b2, b2, b1,
    owner.address, deadline
  ]
  estimatedGas = await router.connect(owner).estimateGas
    .addLiquidityAVAX(...args, { value: b1 })
  res = await router.connect(owner).addLiquidityAVAX(...args,
    { gasLimit: estimatedGas.toNumber() + 50000, value: b1 })
  await res.wait()
  console.log('router.addLiquidityAVAX(1000000dai,900avax)')
  res = await factory.getPair(dai.address, address.Native)
  str = 'const PairDai = "' + res + '";'
  console.log('\t' + str)

  b1 = ethers.utils.parseUnits('100', 18) // wavax
  estimatedGas = await wavax.connect(owner).estimateGas.deposit({ value: b1 })
  res = await wavax.connect(owner).deposit({ value: b1, gasLimit: estimatedGas.toNumber() + 50000 })
  await res.wait()
  console.log('wavax.deposit(100avax)')

  b1 = ethers.utils.parseUnits('90', 18) // wavax
  estimatedGas = await wavax.connect(owner).estimateGas.transfer(distri.address, b1)
  res = await wavax.connect(owner).transfer(distri.address, b1, { gasLimit: estimatedGas.toNumber() + 50000 })
  await res.wait()
  console.log('wavax.transfer(distri,90avax)')

  b1 = ethers.utils.parseUnits('10', 18) // wavax
  estimatedGas = await wavax.connect(owner).estimateGas.transfer(metamask.address, b1)
  res = await wavax.connect(owner).transfer(metamask.address, b1, { gasLimit: estimatedGas.toNumber() + 50000 })
  await res.wait()
  console.log('wavax.transfer(metamask,10avax)')

  console.log()

  return Promise.resolve([
    polar,
    dai,
    old,
    addressPair
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
