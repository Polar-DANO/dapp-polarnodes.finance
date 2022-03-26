/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import * as ethers from 'ethers'
import '@metamask/detect-provider'

import { Plugin } from '@nuxt/types'
import * as addresses from '~/hardhat/scripts/address'
import { abi as HANDLER_ABI } from '~/hardhat/artifacts/contracts/Handler.sol/Handler.json'
import { abi as SWAPPER_ABI } from '~/hardhat/artifacts/contracts/Swapper.sol/Swapper.json'
import { abi as POLAR_ABI } from '~/hardhat/artifacts/contracts/Polar.sol/Polar.json'
import { abi as NODE_TYPE_ABI } from '~/hardhat/artifacts/contracts/NodeType.sol/NodeType.json'
import { abi as POLAR_LUCKY_BOX_ABI } from '~/hardhat/artifacts/contracts/PolarLuckyBox.sol/PolarLuckyBox.json'
import { abi as POLAR_MARKETPLACE_ABI } from '~/hardhat/artifacts/contracts/PolarMarketPlace.sol/PolarMarketPlace.json'

export interface ContractsPlugin {
  $contracts: {
    handler: ethers.Contract;
    polar: ethers.Contract;
    swapper: ethers.Contract;
    luckyBoxes: ethers.Contract;
    marketplace: ethers.Contract;
    nodeTypeByName: (name: string) => Promise<ethers.Contract>;
  },
  $web3Provider: ethers.providers.Web3Provider
  $addresses: typeof addresses
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue extends ContractsPlugin {}
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions extends ContractsPlugin {}
  // nuxtContext.$myInjectedFunction
  interface Context extends ContractsPlugin {}
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> extends ContractsPlugin {}
}

const ethersPlugin: Plugin = (_ctx, inject) => {
  if (!window.ethereum) {
    return
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  inject('web3Provider', provider)

  const nameContractsMap: Record<string, ethers.Contract> = {}

  const contracts: ContractsPlugin['$contracts'] = {
    handler: new ethers.Contract(addresses.Handler, HANDLER_ABI, signer),
    polar: new ethers.Contract(addresses.Token, POLAR_ABI, signer),
    swapper: new ethers.Contract(addresses.Swapper, SWAPPER_ABI, signer),
    luckyBoxes: new ethers.Contract(addresses.PolarLuckyBox, POLAR_LUCKY_BOX_ABI, signer),
    marketplace: new ethers.Contract(addresses.MarketPlace, POLAR_MARKETPLACE_ABI, signer),
    async nodeTypeByName (name: string) {
      if (!nameContractsMap[name]) {
        const address = await this.handler.getNodeTypesAddress(name)
        nameContractsMap[name] = new ethers.Contract(address, NODE_TYPE_ABI, signer)
      }

      return nameContractsMap[name]
    }
  }

  inject('contracts', contracts)
  inject('addresses', addresses)
}

export default ethersPlugin
