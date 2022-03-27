import { BigNumber } from 'ethers'

export enum NFTType {
  Node = 'node',
  LuckyBox = 'luckybox',
}

export interface Offer {
  id: number;
  owner: string;
  nftType: NFTType
  tokenId: BigNumber
  price: BigNumber
  creationTime: Date
}

// TODO : move to models
export interface Auction {
  id: number
  owner: string
  nftType: NFTType
  tokenId: BigNumber
  currentPrice: BigNumber
  end: Date
  creationTime: Date
}

// TODO : move to models
export enum ItemType {
  Offer = 'offer',
  Auction = 'auction'
}
