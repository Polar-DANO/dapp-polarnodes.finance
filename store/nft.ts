import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { BigNumber } from 'ethers'
import { NodeType } from '~/models/NodeType'

interface NFT {
  owner: string;
  nodeType: string;
  tokenId: number;
  creationTime: Date;
  lastClaimTime: Date;
  obtainingTime: Date;
  isBoostedAirDropRate: number
  isBoostedNft: boolean;
  isBoostedToken: boolean;
  feature: string;
  userPendingRewards: BigNumber;
  userPendingFees: BigNumber;
}

export const state = () => ({
  nfts: {} as Record<string, NFT[]>
})

export type State = ReturnType<typeof state>

export const getters: GetterTree<State, {}> = {
  byNodeTypeAndTokenId: state => (nodeType: string, tokenId: number) => state.nfts[nodeType]?.find(nft => nft.tokenId === tokenId),
  byNodeType: (state, getters, rootState, rootGetters) => rootGetters['nodes/nodeTypesNames'].map((name: string) => ({
    nodeType: name,
    nfts: state.nfts[name]
  })),
  byCreationDateDesc: state =>
    Object
      .entries(state.nfts)
      .map(([nodeType, nfts]) => nfts.map(nft => ({ ...nft, nodeType })))
      .flat()
      .sort(
        (a, b) => (b.creationTime.getTime() - a.creationTime.getTime()) || (b.tokenId - a.tokenId)
      )
}

export const mutations: MutationTree<State> = {
  setNFTs (state, nfts: Record<string, NFT[]>) {
    state.nfts = nfts
  },

  resetNFTs (state) {
    state.nfts = {}
  }
}

export const actions: ActionTree<State, {}> = {

  async loadNFTs ({ commit, rootGetters }) {
    const nodeTypeNames: string[] | undefined = rootGetters['nodes/nodeTypesNames']
    if (!nodeTypeNames || nodeTypeNames.length === 0) {
      commit('resetNFTs')
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
          tokenId: tokenId.toNumber(),
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

    commit('setNFTs', Object.fromEntries(entries))
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
    }, {} as Record<string, number[]>)

    const tx = await this.$contracts.handler.claimRewardsBatch(
      this.$addresses.Token,
      userAddress,
      Object.keys(groupped),
      Object.values(groupped)
    )

    await tx.wait()
    dispatch('loadNFTs')
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
    dispatch('loadNFTs')
  }
}
