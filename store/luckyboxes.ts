import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { BigNumber } from 'ethers'
import { LuckyBoxType } from '~/models/luckybox-type'
import { LuckyBox } from '~/models/luckybox'
export const state = () => ({
  luckyBoxTypes: null as (LuckyBoxType[] | null),
  myLuckyBoxes: null as (LuckyBox[] | null),
  byTokenIds: {} as { [tokenId: string]: LuckyBox | null } // null means the tokenId doesn't exist
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  typesNames: state => state.luckyBoxTypes?.map(type => type.name) ?? null,
  typeByName: state => (name: string) => state.luckyBoxTypes?.find(type => type.name === name) ?? null,
  typeById: state => (id: number) => state.luckyBoxTypes?.[id] ?? null,
  byTokenId: state => (tokenId: BigNumber) => state.byTokenIds[tokenId.toString()] ?? null
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

    myLuckyBoxes.forEach((luckyBox) => {
      state.byTokenIds = {
        ...state.byTokenIds,
        [luckyBox.tokenId.toString()]: (luckyBox.type === '') ? null : luckyBox
      }
    })
  },

  setLuckyBox (state, luckyBox: LuckyBox) {
    state.byTokenIds = {
      ...state.byTokenIds,
      [luckyBox.tokenId.toString()]: (luckyBox.type === '') ? null : luckyBox
    }
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
      results.luckyBoxes.filter((box, id) => parseInt(box.maxUser._hex) > 0).map((luckyBox, id): LuckyBoxType => {
          return {
            id,
            name: results.names[id],
            price: luckyBox.priceTokens,
            maxUser: luckyBox.maxUser,
            maxBox: luckyBox.maxBox,
            nodeTypes: luckyBox.nodeType,
            probabilities: luckyBox.probability,
            remaining: luckyBox.remaining,
            features: luckyBox.feature
          }
      })

    commit('setLuckyBoxTypes', luckyBoxesArray)
  },

  async buy ({ dispatch, rootGetters }, { luckyBox, amount, withToken, user }: { luckyBox: LuckyBoxType, amount: number, withToken: string, user: string }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.handler.createLuckyBoxesWithTokens(
      withToken,
      user,
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
    const luckyBoxes = await Promise.all(luckyBoxesTokens.map(async (tokenId): Promise<LuckyBox> => {
      if (!this.$contracts) {
        throw new Error('Contracts not loaded')
      }

      return {
        tokenId,
        owner: userAddress,
        type: await this.$contracts.luckyBoxes.tokenIdsToType(tokenId),
        attribute: await this.$contracts.luckyBoxes.getAttribute(tokenId)
      }
    }))

    commit('setMyLuckyBoxes', luckyBoxes)
  },

  async reveal ({ dispatch, rootGetters }, tokenIds: BigNumber[]) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('Current user address not found')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const estimatedGas = await this.$contracts.handler.estimateGas.createNodesWithLuckyBoxes(
      tokenIds,
    )
    const tx = await this.$contracts.handler.createNodesWithLuckyBoxes(
      tokenIds,
      { gasLimit: estimatedGas.toNumber() + 1500000 }
    )

    await tx.wait()
    dispatch('loadMyLuckyBoxes')
    dispatch('nft/loadMyNFTs', null, { root: true })
  },

  // async allReveal({ dispatch, rootGetters }) {
  //   console.log(this.state.luckyboxes.myLuckyBoxes)
  // },

  async loadByTokenId ({ commit }, tokenId: BigNumber) {
    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    commit('setLuckyBox', {
      tokenId,
      owner: await this.$contracts.luckyBoxes.ownerOf(tokenId),
      type: await this.$contracts.luckyBoxes.tokenIdsToType(tokenId),
      attribute: await this.$contracts.luckyBoxes.getAttribute(tokenId)
    })
  }
}
