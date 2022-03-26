import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { BigNumber } from 'ethers'

export const state = () => ({
  balance: null as (BigNumber | null),
  allowance: null as (BigNumber | null)
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  hasEnoughAllowance: state => (amount: BigNumber) => state.allowance?.gte(amount) ?? false
}

export const mutations: MutationTree<State> = {
  setBalance (state, balance: BigNumber) {
    state.balance = balance
  },

  setAllowance (state, allowance: BigNumber) {
    state.allowance = allowance
  }
}

export const actions: ActionTree<State, {}> = {
  async loadBalance ({ commit, rootGetters }) {
    const addr = rootGetters['wallet/address']
    if (!addr) { return }

    commit('setBalance', await this.$contracts.polar.balanceOf(addr))
  },

  async loadAllowance ({ commit, rootGetters }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    commit('setAllowance', await this.$contracts.polar.allowance(userAddress, this.$addresses.Swapper))
  },

  async requestAllowance ({ rootGetters, dispatch }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    const tx = await this.$contracts.polar.approve(
      this.$addresses.Swapper,
      BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    )
    await tx.wait()
    dispatch('loadAllowance')
  }
}
