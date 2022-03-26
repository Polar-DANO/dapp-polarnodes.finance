import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { BigNumber } from 'ethers'
import * as ethers from 'ethers'
import { ContractsPlugin } from '~/plugins/ethers'

export enum NFTType {
  NodeFuji = 'Fuji',
  NodeMontBlanc = 'Mont Blanc',
  NodeKilimanjaro = 'Kilimanjaro',
  NodeUshuaia = 'Ushuaia',
  NodeEverest = 'Everest',
  LuckyBox = 'luckybox'
}

function getSupportedNfts (addresses: ContractsPlugin['$addresses']): Record<NFTType, string> {
  return {
    [NFTType.NodeFuji]: addresses.NodeType0,
    [NFTType.NodeMontBlanc]: addresses.NodeType1,
    [NFTType.NodeKilimanjaro]: addresses.NodeType2,
    [NFTType.NodeUshuaia]: addresses.NodeType3,
    [NFTType.NodeEverest]: addresses.NodeType4,
    [NFTType.LuckyBox]: addresses.PolarLuckyBox
  }
}

interface Offer {
  id: number;
  owner: string;
  nftType: NFTType
  tokenId: BigNumber
  price: BigNumber
  creationTime: Date
}

interface Auction {
  id: number
  owner: string
  nftType: NFTType
  tokenId: BigNumber
  currentPrice: BigNumber
  end: Date
  creationTime: Date
}

enum ItemType {
  Offer = 'offer',
  Auction = 'auction'
}

export const state = () => ({
  offers: null as (Offer[] | null),
  auctions: null as (Auction[] | null)
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  items: state => [
    ...(state.offers ?? []).map((offer) => {
      return {
        type: 'offer',
        item: offer
      }
    }),
    ...(state.auctions ?? []).map((auction) => {
      return {
        type: 'auction',
        item: auction
      }
    })
  ].sort((a, b) =>
    a.item.creationTime.getTime() - b.item.creationTime.getTime() || a.item.id - b.item.id
  )
}

export const mutations: MutationTree<State> = {
  setOffers (state, offers: Offer[]) {
    state.offers = offers
  },

  setAuctions (state, auctions: Auction[]) {
    state.auctions = auctions
  }
}

export const actions: ActionTree<State, {}> = {
  async loadOffers ({ commit }) {
    const supportedNfts = getSupportedNfts(this.$addresses)

    const offersByNft = await Promise.all(
      Object.entries(supportedNfts).map(async ([nftType, nftAddress]): Promise<Offer[]> => {
        const offerSize = await this.$contracts.marketplace.getOfferOfSize(nftAddress)
        const offers: any[] = await this.$contracts.marketplace.getOfferOfBetweenIndexes(nftAddress, 0, offerSize)

        return offers.map((offer, id): Offer => {
          return {
            id,
            owner: offer.owner,
            nftType: nftType as NFTType,
            tokenId: offer.tokenId,
            price: offer.price,
            creationTime: new Date(offer.creationTime.toNumber() * 1000)
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
        const auctionSize = await this.$contracts.marketplace.getAuctionOfSize(nftAddress)
        const auctions: any[] = await this.$contracts.marketplace.getAuctionOfBetweenIndexes(nftAddress, 0, auctionSize)

        return auctions.map((auction, id): Auction => {
          return {
            id,
            owner: auction.owner,
            nftType: nftType as NFTType,
            tokenId: auction.tokenId,
            currentPrice: auction.currentPrice,
            end: new Date(auction.end.toNumber() * 1000),
            creationTime: new Date(auction.creationTime.toNumber() * 1000)
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

    const tx = await this.$contracts.marketplace.sellAuctionItem(
      supportedNfts[nftType],
      tokenId,
      ethers.utils.parseEther(price.toString()),
      end
    )

    await tx.wait()
    dispatch('loadAuctions')
  }
}
