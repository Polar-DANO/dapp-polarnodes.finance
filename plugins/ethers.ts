/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import * as ethers from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

import { Store } from 'vuex'
import { Plugin } from '@nuxt/types'
import WalletConnectProvider from '@walletconnect/web3-provider'
import * as addresses from '~/hardhat/scripts/address'
import { abi as HANDLER_ABI } from '~/hardhat/artifacts/contracts/Handler.sol/Handler.json'
import { abi as SWAPPER_ABI } from '~/hardhat/artifacts/contracts/Swapper.sol/Swapper.json'
import { abi as POLAR_ABI } from '~/hardhat/artifacts/contracts/Polar.sol/Polar.json'
import { abi as NODE_TYPE_ABI } from '~/hardhat/artifacts/contracts/NodeType.sol/NodeType.json'
import { abi as POLAR_LUCKY_BOX_ABI } from '~/hardhat/artifacts/contracts/PolarLuckyBox.sol/PolarLuckyBox.json'
import { abi as POLAR_MARKETPLACE_ABI } from '~/hardhat/artifacts/contracts/PolarMarketPlace.sol/PolarMarketPlace.json'

export interface ContractsPlugin {
  $contracts?: {
    handler: ethers.Contract;
    polar: ethers.Contract;
    swapper: ethers.Contract;
    luckyBoxes: ethers.Contract;
    marketplace: ethers.Contract;
    nodeTypeByName: (name: string) => Promise<ethers.Contract>;
  },
  $register: {
    metamask: () => Promise<void>;
    walletConnect: () => Promise<void>;
  },
  $logout?: () => Promise<void>;
  $web3Provider?: ethers.providers.Web3Provider;
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

async function registerMetamask () {
  const provider: any = await detectEthereumProvider({
    mustBeMetaMask: true
  })

  if (!provider) {
    throw new Error('Metamask not detected')
  }

  await provider.request({ method: 'eth_requestAccounts' })
  return new ethers.providers.Web3Provider(provider)
}

async function registerWalletConnect () {
  const walletConnect = new WalletConnectProvider({
    rpc: {
      97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      56: 'https://bsc-dataseed1.binance.org/'
    },
    bridge: 'https://bridge.myhostedserver.com',
    qrcodeModalOptions: {
      mobileLinks: [
        'metamask',
        'trust'
      ]
    }
  })

  await walletConnect.enable()
  return new ethers.providers.Web3Provider(walletConnect)
}

function setupListeners (eth: ethers.providers.Web3Provider, store: Store<any>) {
  eth.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length) {
      store.commit('wallet/setAddress', accounts[0])
    } else {
      store.commit('wallet/setAddress', null)
    }
  })

  eth.on('chainChanged', (networkId: number) => {
    store.commit('wallet/setChainId', networkId)
  })

  eth.on('disconnect', () => store.dispatch('wallet/logout'))
}

function checkConnection (makePlugin: (provider: ethers.providers.Web3Provider) => Promise<void>) {
  if (window.ethereum) {
    makePlugin(new ethers.providers.Web3Provider(window.ethereum))
  }
}

const ethersPlugin: Plugin = ({ store }, inject) => {
  const makePlugin = async (provider: ethers.providers.Web3Provider | null) => {
    if (!provider) {
      inject('web3Provider', null)
      inject('contracts', null)
      inject('logout', null)
      return
    }

    inject('web3Provider', provider)
    const signer = provider.getSigner()

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

    setupListeners(provider, store)
    const { address, network } = {
      address: await signer.getAddress(),
      network: await provider.getNetwork()
    }

    store.commit('wallet/setAddress', address)
    store.commit('wallet/setChainId', network.chainId)

    inject('logout', () => {
      store.commit('wallet/logout')
      makePlugin(null)
    })

    inject('contracts', contracts)
  }

  const register = {
    metamask: async () => makePlugin(await registerMetamask()),
    walletConnect: async () => makePlugin(await registerWalletConnect())
  }

  inject('register', register)
  inject('addresses', addresses)

  checkConnection(makePlugin)
}

export default ethersPlugin
