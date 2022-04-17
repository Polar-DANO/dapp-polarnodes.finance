import { NFTType, Offer, Auction } from '~/models/marketplace';

const state = () => ({
  offers: null as (Offer[] | null),
  auctions: null as (Auction[] | null),
  isApprovedForNFTType: {} as Record<NFTType, boolean>,
});

export default state;
export type State = ReturnType<typeof state>;
