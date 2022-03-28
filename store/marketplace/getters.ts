import { GetterTree } from 'vuex'
import { State } from './state'
import { NFTType, Item } from '~/models/marketplace'

const getters: GetterTree<State, {}> = {
  items: (state): Item[] => [
    ...(state.offers ?? []),
    ...(state.auctions ?? [])
  ].sort((a, b) => a.creationTime.getTime() - b.creationTime.getTime()
  ),

  isApprovedForNFTType: state => (nftType: NFTType): boolean => {
    return state.isApprovedForNFTType[nftType] ?? false
  }
}

export default getters
