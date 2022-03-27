import * as ethers from 'ethers'
import { PAYOUTS_PER_DAY } from '~/models/constants'

export interface NodeType {
  index: number;
  name: string;
  rewardAmount: ethers.BigNumber;
  cost: ethers.BigNumber;
  claimTax: number;
  userCount?: number;
  userRewards?: ethers.BigNumber;
  userFees?: ethers.BigNumber;

  totalCreatedNodes: number;
  maxSlots: number;
  maxLevelUpUser: number;
  maxLevelUpGlobal: number;
  maxCreationPendingUser: number;
  maxCreationPendingGlobal: number;
}

export function dailyRewardsPerUser (node: NodeType) {
  return node.rewardAmount.mul(node.userCount ?? 0).mul(PAYOUTS_PER_DAY)
}

export function dailyRewardPerNode (node: NodeType) {
  return node.rewardAmount.mul(PAYOUTS_PER_DAY)
}

export function roi (node: NodeType) {
  if (node.cost.eq(0)) {
    return Infinity
  }

  return (
    (ethers.utils.formatEther(dailyRewardPerNode(node)) as unknown as number) /
    (ethers.utils.formatEther(node.cost) as unknown as number)
  ) * 100
}
