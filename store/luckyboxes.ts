import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { BigNumber } from 'ethers'
import { LuckyBoxType } from '~/models/LuckyBoxType'
import { LuckyBox } from '~/models/LuckyBox'

export const state = () => ({
  luckyBoxTypes: null as (LuckyBoxType[] | null),
  myLuckyBoxes: null as (LuckyBox[] | null)
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  typeById: state => (id: number) => state.luckyBoxTypes?.[id] ?? null
}

export const mutations: MutationTree<State> = {
  setLuckyBoxTypes (state, types: LuckyBoxType[]) {
    state.luckyBoxTypes = types
  },

  setMyLuckyBoxes (state, myLuckyBoxes: LuckyBox[]) {
    state.myLuckyBoxes = myLuckyBoxes.sort((a, b) => {
      const cmp = b.tokenId.sub(a.tokenId)
      return cmp.gt(0) ? 1 : cmp.lt(0) ? -1 : 0
    })
  }
}

export const actions: ActionTree<State, {}> = {
  async loadLuckyBoxTypes ({ commit }) {
    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const luckyBoxesSize = await this.$contracts.luckyBoxes.getBoxSize()
    const results = {
      names: (await this.$contracts.luckyBoxes.getMapKeysBetweenIndexes(0, luckyBoxesSize)) as string[],
      luckyBoxes: (await this.$contracts.luckyBoxes.getMapBetweenIndexes(0, luckyBoxesSize)) as any[]
    }

    const luckyBoxesArray =
      results.luckyBoxes.map((luckyBox, id): LuckyBoxType => {
        return {
          id,
          name: results.names[id],
          price: luckyBox.priceTokens,
          maxUser: luckyBox.maxUser,
          maxBox: luckyBox.maxBox,
          nodeTypes: luckyBox.nodeType,
          probabilities: luckyBox.probability,
          remaining: luckyBox.remaining
        }
      })

    commit('setLuckyBoxTypes', luckyBoxesArray)
  },

  async buy ({ dispatch, rootGetters }, { luckyBox, amount }: { luckyBox: LuckyBoxType, amount: number }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.handler.createLuckyBoxesWithTokens(
      this.$addresses.Token,
      luckyBox.name,
      amount,
      '' // sponso
    )

    await tx.wait()
    dispatch('loadMyLuckyBoxes')
  },

  async loadMyLuckyBoxes ({ commit, rootGetters }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const luckyBoxesTokens: BigNumber[] = await this.$contracts.luckyBoxes.tokensOfOwner(userAddress)
    const luckyBoxes = await Promise.all(luckyBoxesTokens.map(async (tokenId) => {
      if (!this.$contracts) {
        throw new Error('Contracts not loaded')
      }

      return {
        tokenId,
        type: await this.$contracts.luckyBoxes.tokenIdsToType(tokenId)
      }
    }))

    commit('setMyLuckyBoxes', luckyBoxes)
  }
}
