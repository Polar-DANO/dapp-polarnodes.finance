import { BigNumber } from 'ethers';

export enum NFTType {
  Node = 'node',
  LuckyBox = 'luckybox'
}

export interface NFT {
  nftType: NFTType
  tokenId: BigNumber;
  owner: string;
  attribute: string;
}

export enum ItemType {
  Offer = 'offer',
  Auction = 'auction'
}

export interface Offer {
  type: ItemType.Offer
  nft: NFT;
  creationTime: Date
  price: BigNumber
}

export interface Auction {
  type: ItemType.Auction;
  nft: NFT;
  creationTime: Date
  currentPrice: BigNumber
  end: Date
}

export type Item = Offer | Auction;
