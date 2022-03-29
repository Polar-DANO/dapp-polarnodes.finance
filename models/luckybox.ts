import { BigNumber } from 'ethers'

export interface LuckyBox {
  tokenId: BigNumber;
  owner: string;
  type: string;
  attribute: string;
}
