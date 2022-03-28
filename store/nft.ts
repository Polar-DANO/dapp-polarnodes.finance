import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { BigNumber } from 'ethers'
import { NodeType } from '~/models/NodeType'
import { NFT } from '~/models/nft'

export const state = () => ({
  myNfts: {} as Record<string, NFT[]>,
  byTokenId: {} as Record<string, NFT | null>
})

export type State = ReturnType<typeof state>

export const getters: GetterTree<State, {}> = {
  myNFTsByNodeType: (state, getters, rootState, rootGetters) => rootGetters['nodes/nodeTypesNames'].map((name: string) => ({
    nodeType: name,
    nfts: state.myNfts[name]
  })),
  myNFTsByCreationDateDesc: state =>
    Object
      .entries(state.myNfts)
      .map(([nodeType, nfts]) => nfts.map(nft => ({ ...nft, nodeType })))
      .flat()
      .sort(
        (a, b) => (b.creationTime.getTime() - a.creationTime.getTime())
      ),
  byTokenId: state => (tokenId: string) => state.byTokenId[tokenId]
}

export const mutations: MutationTree<State> = {
  setMyNFTs (state, nfts: Record<string, NFT[]>) {
    state.myNfts = nfts
  },

  resetMyNFTs (state) {
    Object.values(state.myNfts).flat().forEach((nft) => {
      state.byTokenId[nft.tokenId.toString()] = nft
    })
    state.myNfts = {}
  },

  setByTokenId (state, { tokenId, nft }: { tokenId: BigNumber, nft: NFT | null }) {
    state.byTokenId = {
      ...state.byTokenId,
      [tokenId.toString()]: nft
    }
  }
}

export const actions: ActionTree<State, {}> = {

  async loadMyNFTs ({ commit, rootGetters }) {
    const nodeTypeNames: string[] | undefined = rootGetters['nodes/nodeTypesNames']
    if (!nodeTypeNames || nodeTypeNames.length === 0) {
      commit('resetMyNFTs')
      return
    }

    const nftsIndexByNodeType = await Promise.all(nodeTypeNames.map(async (nodeTypeName) => {
      const nodeType: NodeType | undefined = rootGetters['nodes/nodeTypeByName'](nodeTypeName)
      const userAddress = rootGetters['wallet/address']

      if (!userAddress || !nodeType) {
        return null
      }

      if (!this.$contracts) {
        throw new Error('Contracts not loaded')
      }

      const nodeTypeContract = await this.$contracts.nodeTypeByName(nodeTypeName)

      const totalCount = await nodeTypeContract.getTotalNodesNumberOf(userAddress)
      const tokenIds: BigNumber[] = await nodeTypeContract.getTokenIdsOfBetweenIndexes(userAddress, 0, totalCount)

      const { nfts, pendingRewards } = {
        nfts: await Promise.all(tokenIds.map(async (tokenId) => {
          const nft = await nodeTypeContract.getNodeFromTokenId(tokenId)
          return { nft, tokenId }
        })),
        pendingRewards: await nodeTypeContract.calculateUserRewardsBatch(userAddress, tokenIds) as [BigNumber[], BigNumber[]]
      }

      return nfts.map(({ nft, tokenId }, idx): NFT => {
        return {
          owner: nft.owner,
          nodeType: nodeType.name,
          tokenId,
          creationTime: new Date(nft.creationTime.toNumber() * 1000),
          lastClaimTime: new Date(nft.lastClaimTime.toNumber() * 1000),
          obtainingTime: new Date(nft.obtainingTime.toNumber() * 1000),
          isBoostedAirDropRate: nft.isBoostedAirDropRate.toNumber() / 100,
          isBoostedNft: nft.isBoostedNft,
          isBoostedToken: nft.isBoostedToken,
          feature: nft.feature,
          userPendingRewards: pendingRewards[0][idx],
          userPendingFees: pendingRewards[1][idx]
        }
      })
    }))

    const entries = nftsIndexByNodeType
      .map((nfts, idx) => {
        return [
          nodeTypeNames[idx],
          nfts
        ]
      })
      .filter(([, nfts]) => nfts !== null)

    commit('setMyNFTs', Object.fromEntries(entries))
  },

  async claimRewards ({ dispatch, rootGetters }, nfts: NFT[]) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('You must connect your wallet')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const groupped = nfts.reduce((nodeTypeGroups, nft) => {
      if (!nodeTypeGroups[nft.nodeType]) {
        nodeTypeGroups[nft.nodeType] = []
      }
      nodeTypeGroups[nft.nodeType].push(nft.tokenId)
      return nodeTypeGroups
    }, {} as Record<string, BigNumber[]>)

    const tx = await this.$contracts.handler.claimRewardsBatch(
      this.$addresses.Token,
      userAddress,
      Object.keys(groupped),
      Object.values(groupped)
    )

    await tx.wait()
    dispatch('loadMyNFTs')
  },

  async claimAll ({ dispatch, rootGetters }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('You must connect your wallet')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.handler.claimRewardsAll(
      this.$addresses.Token,
      userAddress
    )

    await tx.wait()
    dispatch('loadMyNFTs')
  },

  async loadByTokenId ({ commit }, tokenId: BigNumber) {
    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const nodeType = await this.$contracts.polarNodeNft.tokenIdsToType(tokenId)
    if (nodeType === '') {
      commit('setByTokenId', null)
    }

    const nodeTypeContract = await this.$contracts.nodeTypeByName(nodeType)

    const node: any = await nodeTypeContract.getNodeFromTokenId(tokenId)
    const pendingRewards = await nodeTypeContract.calculateUserRewardsBatch(node.owner, [tokenId]) as [[BigNumber], [BigNumber]]

    const nft: NFT = {
      owner: node.owner,
      nodeType,
      tokenId,
      creationTime: new Date(node.creationTime.toNumber() * 1000),
      lastClaimTime: new Date(node.lastClaimTime.toNumber() * 1000),
      obtainingTime: new Date(node.obtainingTime.toNumber() * 1000),
      isBoostedAirDropRate: node.isBoostedAirDropRate.toNumber() / 100,
      isBoostedNft: node.isBoostedNft,
      isBoostedToken: node.isBoostedToken,
      feature: node.feature,
      userPendingRewards: pendingRewards[0][0],
      userPendingFees: pendingRewards[1][0]
    }

    commit('setByTokenId', { tokenId, nft })
  }
}
