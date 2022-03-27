import { GetterTree, MutationTree, ActionTree } from 'vuex'

export const state = () => ({
  address: null as (string | null),
  chainId: null as (number | null)
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  address: store => store.address,
  isConnected: store => store.chainId !== null,
  hasAddress: store => store.address !== null
}

export const mutations: MutationTree<State> = {
  setAddress (state, address: string | null) {
    state.address = address
  },

  setChainId (state, chainId: number | null) {
    state.chainId = chainId
  },

  logout (state) {
    state.address = null
    state.chainId = null
  }
}

export const actions: ActionTree<State, {}> = {
  async logout () {
    if (this.$logout) {
      await this.$logout()
    }
  },

  async requestMetamask ({ getters }) {
    if (getters.isConnected) {
      return
    }

    await this.$register.metamask()
  },

  async requestWalletConnect ({ getters }) {
    if (getters.isConnected) {
      return
    }

    await this.$register.walletConnect()
  }
}
