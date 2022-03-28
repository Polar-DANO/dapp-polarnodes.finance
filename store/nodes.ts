import { MutationTree, ActionTree, GetterTree } from 'vuex'
import * as ethers from 'ethers'
import * as NodeType from '~/models/NodeType'

export const state = () => ({
  nodeTypes: null as (NodeType.NodeType[] | null)
})

export type State = ReturnType<typeof state>

export const getters: GetterTree<State, {}> = {
  totalCreated: state => state.nodeTypes?.reduce((total, nodeType) => total + nodeType.totalCreatedNodes, 0) ?? null,
  myTotalCreated: state => state.nodeTypes?.reduce((total, nodeType) => total + (nodeType?.userCount ?? 0), 0) ?? null,
  nodeTypesNames: state => state.nodeTypes?.map(node => node.name),
  nodeTypeByName: state => (name: string) => state.nodeTypes?.find(node => node.name === name),
  totalDailyRewards: state => state.nodeTypes?.reduce(
    (total, node) =>
      total.add(NodeType.dailyRewardsPerUser(node)),
    ethers.BigNumber.from(0)
  ) ?? null,
  totalPendingRewards: state => state.nodeTypes?.reduce(
    (total, node) =>
      total.add(node?.userRewards ?? 0),
    ethers.BigNumber.from(0)
  ) ?? null
}

export const mutations: MutationTree<State> = {
  setNodeTypes (state, nodeTypes: NodeType.NodeType[]) {
    state.nodeTypes = nodeTypes
  },
  setUserRewardsForNodeType (state, { nodeTypeName, rewards, fees }) {
    state.nodeTypes = state.nodeTypes?.map((node) => {
      if (node.name === nodeTypeName) {
        node.userRewards = rewards
        node.userFees = fees
      }

      return node
    }) ?? null
  }
}

interface CreateNodesWithPendingArgs {
  selectedNodes: {
    tokenId: number, nodeType: string
  }[]
  tokenOut: string
  nodeTypeTo: string
  count: number
}

export const actions: ActionTree<State, {}> = {
  async loadNodeTypes ({ commit, dispatch, rootGetters }) {
    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const nodeSize = (await this.$contracts.handler.getNodeTypesSize()).toNumber()
    const nodeTypesNames: string[] = await this.$contracts.handler.getNodeTypesBetweenIndexes(0, nodeSize)

    const nodeTypes = await Promise.all(
      nodeTypesNames.map(async (name, index): Promise<NodeType.NodeType> => {
        if (!this.$contracts) {
          throw new Error('Contracts not loaded')
        }

        const nodeTypeContract = await this.$contracts.nodeTypeByName(name)
        const userAddress = rootGetters['wallet/address']

        return {
          index,
          name,
          cost: await nodeTypeContract.price(),
          claimTax: (await nodeTypeContract.claimTaxRoi()).div(100).toNumber(),
          rewardAmount: await nodeTypeContract.rewardAmount(),
          userCount: (userAddress)
            ? (await nodeTypeContract.getTotalNodesNumberOf(userAddress)).toNumber()
            : null,
          totalCreatedNodes: (await nodeTypeContract.totalCreatedNodes()).toNumber(),
          maxSlots: (await nodeTypeContract.maxCount()).toNumber(),
          maxLevelUpUser: (await nodeTypeContract.maxLevelUpUser()).toNumber(),
          maxLevelUpGlobal: (await nodeTypeContract.maxLevelUpTotal()).toNumber(),
          maxCreationPendingUser: (await nodeTypeContract.maxCreationPendingUser()).toNumber(),
          maxCreationPendingGlobal: (await nodeTypeContract.maxCreationPendingTotal()).toNumber()
        }
      })
    )

    commit('setNodeTypes', nodeTypes)
    nodeTypes.forEach(node => dispatch('loadUserRewardsByNodeType', node.name))
  },
  async loadNodeTypeByName ({ dispatch }, _name) {
    await dispatch('loadNodeTypes')
  },
  async loadUserRewardsByNodeType ({ commit, getters, rootGetters }, nodeTypeName: string) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      commit('setUserRewardsForNodeType', { nodeTypeName, rewards: null, fees: null })
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const nodeType = getters.nodeTypeByName(nodeTypeName)
    if (!nodeType) { throw new Error(`Node type ${nodeTypeName} not found in state`) }

    const nodeTypeContract = await this.$contracts.nodeTypeByName(nodeType.name)

    const [rewards, fees]: [ethers.BigNumber, ethers.BigNumber] = await nodeTypeContract.calculateUserRewards(userAddress)
    commit('setUserRewardsForNodeType', { nodeTypeName, rewards, fees })
  },

  async createNodesFromToken ({ dispatch }, { nodeTypeName, user, count, token }) {
    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    await this.$contracts.handler.createNodesWithTokens(token, user, nodeTypeName, count, '')
    dispatch('nft/loadMyNFTs', null, { root: true })
  },

  async createNodesWithPendingRewards ({ dispatch }, { selectedNodes, tokenOut, nodeTypeTo, count }: CreateNodesWithPendingArgs) {
    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    if (selectedNodes.length === 0) { return }

    const tokenIdsPerNodeType = selectedNodes.reduce((acc, { tokenId, nodeType }) => {
      if (!acc[nodeType]) { acc[nodeType] = [] }
      acc[nodeType].push(tokenId)
      return acc
    }, {} as Record<string, number[]>)

    const nodeTypes = Object.keys(tokenIdsPerNodeType)
    const tokenIdDoubleIndex = nodeTypes.map((nodeType) => {
      return tokenIdsPerNodeType[nodeType]
    })

    await this.$contracts.handler.createNodesWithPending(
      tokenOut,
      nodeTypes,
      tokenIdDoubleIndex,
      nodeTypeTo,
      count
    )

    dispatch('nft/loadMyNFTs', null, { root: true })
  },

  async createNodesLevelUp ({ dispatch }, { selectedNodes, tokenOut, nodeTypeTo, count }: CreateNodesWithPendingArgs) {
    if (selectedNodes.length === 0) { return }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tokenIdsPerNodeType = selectedNodes.reduce((acc, { tokenId, nodeType }) => {
      if (!acc[nodeType]) { acc[nodeType] = [] }
      acc[nodeType].push(tokenId)
      return acc
    }, {} as Record<string, number[]>)

    const nodeTypes = Object.keys(tokenIdsPerNodeType)
    const tokenIdDoubleIndex = nodeTypes.map((nodeType) => {
      return tokenIdsPerNodeType[nodeType]
    })

    await this.$contracts.handler.createNodesLevelUp(
      tokenOut,
      nodeTypes,
      tokenIdDoubleIndex,
      nodeTypeTo,
      count
    )

    dispatch('nft/loadMyNFTs', null, { root: true })
  }
}
