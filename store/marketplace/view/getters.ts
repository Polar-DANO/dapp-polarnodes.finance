import { GetterTree } from 'vuex'
import { BigNumber } from 'ethers'
import { State, ViewType } from './state'
import { Auction, Item, ItemType, NFTType } from '~/models/marketplace'
import { NFT } from '~/models/nft'
import { LuckyBox } from '~/models/luckybox'

type RootGetters = {
  'marketplace/items': Item[],
  'nft/byTokenId': (tokenId: BigNumber) => NFT | null,
  'luckyboxes/byTokenId': (tokenId: BigNumber) => LuckyBox | null,
  'wallet/address': string | null
}

const getValue = (item: Item) => {
  if (item.type === ItemType.Offer) {
    return item.price
  }

  if (item.type === ItemType.Auction) {
    return item.currentPrice
  }

  return null
}

const views: Record<ViewType, (items: Item[], rootGetters: RootGetters) => Item[]> = {
  [ViewType.Latest]: items => [...items].sort((a, b) => b.creationTime.getTime() - a.creationTime.getTime()),
  [ViewType.MyNFTs]: (items, getters) => items.filter(item => item.nft.owner === getters['wallet/address']),
  [ViewType.DescValue]: items =>
    [...items]
      .filter(item => getValue(item) !== null)
      .sort((a, b) => {
        const valueA = getValue(a)
        const valueB = getValue(b)

        if (valueA === null || valueB === null) {
          return 0
        }

        return valueB.gt(valueA) ? 1 : valueB.lt(valueA) ? -1 : 0
      }),
  [ViewType.ExpiringSoon]: items =>
    items
      .filter((item): item is Auction => item.type === ItemType.Auction)
      .sort((a, b) => a.end.getTime() - b.end.getTime())
}

const getters: GetterTree<State, {}> = {
  current: (state, getters, rootState, rootGetters: RootGetters) => {
    const items = rootGetters['marketplace/items']

    const filtered = items.filter((item) => {
      if (state.filter.length === 0) {
        return item
      }

      return state.filter.some((filter) => {
        switch (filter.type) {
          case NFTType.Node:
            return item.nft.nftType === NFTType.Node && rootGetters['nft/byTokenId'](item.nft.tokenId)?.nodeType === filter.name
          case NFTType.LuckyBox:
            return item.nft.nftType === NFTType.LuckyBox && rootGetters['luckyboxes/byTokenId'](item.nft.tokenId)?.type === filter.name
        }
        return false
      })
    })

    const view = views[state.viewType] ?? (noop => noop)
    return view(filtered, rootGetters)
  }
}

export default getters
