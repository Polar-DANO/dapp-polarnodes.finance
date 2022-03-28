import { ActionTree, MutationTree, GetterTree } from 'vuex'
import * as ethers from 'ethers'
import { ContractsPlugin } from '~/plugins/ethers'
import { NFTType, Offer, Auction, ItemType, Item } from '~/models/marketplace'

function getSupportedNfts (addresses: ContractsPlugin['$addresses']): Record<NFTType, string> {
  return {
    [NFTType.Node]: addresses.PolarNode,
    [NFTType.LuckyBox]: addresses.PolarLuckyBox
  }
}

export const state = () => ({
  offers: null as (Offer[] | null),
  auctions: null as (Auction[] | null),
  isApprovedForNFTType: {} as Record<NFTType, boolean>
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  items: (state): Item[] => [
    ...(state.offers ?? []),
    ...(state.auctions ?? [])
  ].sort((a, b) =>
    a.creationTime.getTime() - b.creationTime.getTime()
  ),

  isApprovedForNFTType: state =>
    (nftType: NFTType): boolean => {
      return state.isApprovedForNFTType[nftType] ?? false
    }
}

export const mutations: MutationTree<State> = {
  setOffers (state, offers: Offer[]) {
    state.offers = offers
  },

  setAuctions (state, auctions: Auction[]) {
    state.auctions = auctions
  },

  setApprovedForNftType (state, { nftType, isApproved }: { nftType: NFTType, isApproved: boolean }) {
    state.isApprovedForNFTType = {
      ...state.isApprovedForNFTType,
      [nftType]: !!isApproved
    }
  },

  resetApproved (state) {
    state.isApprovedForNFTType = {} as Record<NFTType, boolean>
  }
}

export const actions: ActionTree<State, {}> = {
  async loadOffers ({ commit }) {
    const supportedNfts = getSupportedNfts(this.$addresses)

    const offersByNft = await Promise.all(
      Object.entries(supportedNfts).map(async ([nftType, nftAddress]): Promise<Offer[]> => {
        if (!this.$contracts) {
          throw new Error('Contracts not loaded')
        }

        const offerSize = await this.$contracts.marketplace.getOfferOfSize(nftAddress)
        const offers: any[] = await this.$contracts.marketplace.getOfferOfBetweenIndexes(nftAddress, 0, offerSize)

        return offers.map((offer): Offer => {
          return {
            type: ItemType.Offer,
            nft: {
              owner: offer.owner,
              tokenId: offer.tokenId,
              nftType: nftType as NFTType
            },
            creationTime: new Date(offer.creationTime.toNumber() * 1000),
            price: offer.price
          }
        })
      })
    )

    commit('setOffers', offersByNft.flat())
  },

  async loadAuctions ({ commit }) {
    const supportedNfts = getSupportedNfts(this.$addresses)

    const auctionsByNft = await Promise.all(
      Object.entries(supportedNfts).map(async ([nftType, nftAddress]): Promise<Auction[]> => {
        if (!this.$contracts) {
          throw new Error('Contracts not loaded')
        }
        const auctionSize = await this.$contracts.marketplace.getAuctionOfSize(nftAddress)
        const auctions: any[] = await this.$contracts.marketplace.getAuctionOfBetweenIndexes(nftAddress, 0, auctionSize)

        return auctions.map((auction): Auction => {
          return {
            type: ItemType.Auction,
            nft: {
              owner: auction.owner,
              tokenId: auction.tokenId,
              nftType: nftType as NFTType
            },
            creationTime: new Date(auction.creationTime.toNumber() * 1000),
            currentPrice: auction.currentPrice,
            end: new Date(auction.end.toNumber() * 1000)
          }
        })
      })
    )

    commit('setAuctions', auctionsByNft.flat())
  },

  async load ({ dispatch }) {
    await Promise.all([
      dispatch('loadOffers'),
      dispatch('loadAuctions')
    ])
  },

  async sellOffer ({ dispatch, rootGetters }, { nftType, tokenId, price }: { nftType: NFTType, tokenId: number, price: number }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('User address is not defined')
    }

    const supportedNfts = getSupportedNfts(this.$addresses)
    if (!supportedNfts[nftType]) {
      throw new Error('NFT type is not supported')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.marketplace.sellOfferItem(
      supportedNfts[nftType],
      tokenId,
      ethers.utils.parseEther(price.toString())
    )

    await tx.wait()
    dispatch('loadOffers')
  },

  async sellAuction ({ dispatch, rootGetters }, { nftType, tokenId, price, end }: { nftType: NFTType, tokenId: number, price: number, end: number }) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('User address is not defined')
    }

    const supportedNfts = getSupportedNfts(this.$addresses)
    if (!supportedNfts[nftType]) {
      throw new Error('NFT type is not supported')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.marketplace.sellAuctionItem(
      supportedNfts[nftType],
      tokenId,
      ethers.utils.parseEther(price.toString()),
      end
    )

    await tx.wait()
    dispatch('loadAuctions')
  },

  async loadApproveForNftType ({ commit, rootGetters }, nftType: NFTType) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      commit('resetApprovedForNftType')
      return
    }

    const nftAddress = getSupportedNfts(this.$addresses)[nftType]
    if (!nftAddress) {
      throw new Error('NFT type is not supported')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    commit('setApprovedForNftType', {
      nftType,
      isApproved: await this.$contracts.erc721(nftAddress).isApprovedForAll(userAddress, this.$addresses.MarketPlace)
    })
  },

  async approveForNftType ({ dispatch, rootGetters }, nftType: NFTType) {
    const userAddress = rootGetters['wallet/address']
    if (!userAddress) {
      throw new Error('User address is not defined')
    }

    const nftAddress = getSupportedNfts(this.$addresses)[nftType]
    if (!nftAddress) {
      throw new Error('NFT type is not supported')
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded')
    }

    const tx = await this.$contracts.erc721(nftAddress).setApprovalForAll(this.$addresses.MarketPlace, true)
    await tx.wait()
    dispatch('loadApproveForNftType', nftType)
  }
}
