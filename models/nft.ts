import { BigNumber } from 'ethers';

export interface NFT {
  owner: string;
  nextOwner?: string;
  nodeType: string;
  tokenId: BigNumber;
  creationTime: Date;
  lastClaimTime: Date;
  obtainingTime: Date;
  isBoostedAirDropRate: number
  isBoostedNft: boolean;
  isBoostedToken: boolean;
  feature: string;
  userPendingRewards: BigNumber;
  userPendingFees: BigNumber;
  attribute: string;
  timeRoi?: Date;
}
