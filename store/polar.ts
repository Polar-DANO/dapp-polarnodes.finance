import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { BigNumber } from 'ethers'
import addresses from '~/hardhat/scripts/address'

export const state = () => ({
  balance: null as (BigNumber | null),
  allowance: {} as { [address: string]: BigNumber }
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  hasEnoughSwapperAllowance: state => (amount: BigNumber) => state.allowance[addresses.Swapper]?.gte(amount) ?? false,
  hasEnoughMarketplaceAllowance: state => (amount: BigNumber) => state.allowance[addresses.MarketPlace]?.gte(amount) ?? false
}

export const mutations: MutationTree<State> = {
  setBalance (state, balance: BigNumber) {
    state.balance = balance
  },

  setAllowance (state, args: { allowance: BigNumber, address: string }) {
    state.allowance = {
      ...state.allowance,
      [args.address]: args.allowance
    }
  }
}

export const actions: ActionTree<State, {}> = {
  async loadBalance ({ commit, rootGetters }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    commit('setBalance', await this.$contracts.polar.balanceOf(userAddress))
  },

  async loadAllowance ({ commit, rootGetters }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      commit('setAllowance', null)
    }

    await Promise.all(
      [
        this.$addresses.Swapper,
        this.$addresses.MarketPlace
      ]
        .map(async (address) => {
          if (!this.$contracts) {
            throw new Error('Contracts not loaded')
          }

          commit('setAllowance', {
            allowance: await this.$contracts.polar.allowance(userAddress, address),
            address
          })
        })
    )
  },

  async requestSwapperAllowance ({ rootGetters, dispatch }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.polar.approve(
      this.$addresses.Swapper,
      BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    )
    await tx.wait()
    dispatch('loadAllowance')
  },

  async requestMarketplaceAllowance ({ rootGetters, dispatch }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.polar.approve(
      this.$addresses.MarketPlace,
      BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    )
    await tx.wait()
    dispatch('loadAllowance')
  }
}
