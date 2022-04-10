import { MutationTree } from 'vuex';
import { State } from './state';
import { NFTType, Offer, Auction } from '~/models/marketplace';

function filterEmptyAttributes<T extends { nft: { attribute: string } }> (items: T[]): T[] {
  return items.filter(item => item.nft.attribute !== '');
}

const mutations: MutationTree<State> = {
  setOffers (state, offers: Offer[]) {
    state.offers = filterEmptyAttributes(offers);
  },

  setAuctions (state, auctions: Auction[]) {
    state.auctions = filterEmptyAttributes(auctions);
  },

  setApprovedForNftType (state, { nftType, isApproved }: { nftType: NFTType; isApproved: boolean; }) {
    state.isApprovedForNFTType = {
      ...state.isApprovedForNFTType,
      [nftType]: !!isApproved,
    };
  },

  resetApproved (state) {
    state.isApprovedForNFTType = {} as Record<NFTType, boolean>;
  },
};

export default mutations;
