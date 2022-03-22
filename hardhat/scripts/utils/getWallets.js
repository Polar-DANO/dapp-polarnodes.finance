const { ethers } = require('hardhat')
const { Owner, Metamask, Payees, Distri } = require('../key')

async function getWallets () {
  const owner = new ethers.Wallet(Owner, ethers.provider)

  const metamask = new ethers.Wallet(Metamask, ethers.provider)

  const payees = []
  for (const privateKey of Payees) {
    payees.push(new ethers.Wallet(privateKey, ethers.provider))
  }

  const distri = new ethers.Wallet(Distri, ethers.provider)

  return [owner, metamask, payees, distri]
}

module.exports = {
  getWallets
}
