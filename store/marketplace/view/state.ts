import { NFTType } from '~/models/marketplace'

export type NFTTypeFilter = {
  type: NFTType
  name: string
}

export enum ViewType {
  Latest,
  MyNFTs,
  DescValue,
  ExpiringSoon,
}

const state = () => ({
  filter: [] as NFTTypeFilter[],
  viewType: ViewType.Latest
})

export default state
export type State = ReturnType<typeof state>;
