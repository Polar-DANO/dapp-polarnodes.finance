import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { BigNumber } from 'ethers'
import addresses from '~/hardhat/scripts/address'

export const state = () => ({
  tokens: {
    POLAR: { address: addresses.Token, symbol: '$POLAR' },
    DAI: { address: addresses.Dai, symbol: 'DAI' }
  },
  balance: {} as { [tokenAddress: string]: (BigNumber | null) },
  allowance: {} as { [tokenAddress: string] : { [address: string]: BigNumber } }
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  balanceForToken: state => (tokenAddress: string) => {
    return state.balance[tokenAddress] ?? BigNumber.from(0)
  },
  hasEnoughSwapperAllowance: state => (token: string, amount: BigNumber) => state.allowance[token]?.[addresses.Swapper]?.gte(amount) ?? false,
  hasEnoughMarketplaceAllowance: state => (token: string, amount: BigNumber) => state.allowance[token]?.[addresses.MarketPlace]?.gte(amount) ?? false
}

export const mutations: MutationTree<State> = {
  setBalance (state, { balance, token }: { balance: BigNumber, token: string }) {
    state.balance = {
      ...state.balance,
      [token]: balance
    }
  },

  setAllowance (state, args: { allowance: BigNumber, address: string, token: string } | null) {
    if (!args) {
      state.allowance = {}
      return
    }

    state.allowance = {
      ...state.allowance,
      [args.token]: {
        ...state.allowance[args.token],
        [args.address]: args.allowance
      }
    }
  }
}

export const actions: ActionTree<State, {}> = {
  async loadBalance ({ commit, rootGetters }, token: string) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    commit('setBalance', {
      balance: await this.$contracts.erc20(token).balanceOf(userAddress),
      token
    })
  },

  async loadAllowance ({ commit, rootGetters }, token: string) {
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
            allowance: await this.$contracts.erc20(token).allowance(userAddress, address),
            address,
            token
          })
        })
    )
  },

  async requestSwapperAllowance ({ rootGetters, dispatch }, token: string) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.erc20(token).approve(
      this.$addresses.Swapper,
      BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    )
    await tx.wait()
    dispatch('loadAllowance', token)
  },

  async requestMarketplaceAllowance ({ rootGetters, dispatch }, token: string) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.erc20(token).approve(
      this.$addresses.MarketPlace,
      BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    )
    await tx.wait()
    dispatch('loadAllowance')
  }
}
