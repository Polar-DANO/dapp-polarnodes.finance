import { MutationTree } from 'vuex'
import { State } from './state'
import { NFTType, Offer, Auction } from '~/models/marketplace'

const mutations: MutationTree<State> = {
  setOffers (state, offers: Offer[]) {
    state.offers = offers
  },

  setAuctions (state, auctions: Auction[]) {
    state.auctions = auctions
  },

  setApprovedForNftType (state, { nftType, isApproved }: { nftType: NFTType; isApproved: boolean; }) {
    state.isApprovedForNFTType = {
      ...state.isApprovedForNFTType,
      [nftType]: !!isApproved
    }
  },

  resetApproved (state) {
    state.isApprovedForNFTType = {} as Record<NFTType, boolean>
  }
}

export default mutations
