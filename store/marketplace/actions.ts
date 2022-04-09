import { ActionTree, Store } from 'vuex';
import * as ethers from 'ethers';
import { BigNumber } from 'ethers';
import { State } from './state';
import { NFTType, Offer, Auction, ItemType, NFT } from '~/models/marketplace';
import { ContractsPlugin } from '~/plugins/ethers';

function getSupportedNfts (addresses: ContractsPlugin['$addresses']): Record<NFTType, string> {
  return {
    [NFTType.Node]: addresses.PolarNode,
    [NFTType.LuckyBox]: addresses.PolarLuckyBox,
  };
}

async function fetchAttribute<T> (this: Store<T>, nftType: NFTType, tokenId: BigNumber): Promise<string> {
  const contract = (nftType === NFTType.Node) ? this.$contracts?.polarNodeNft : this.$contracts?.luckyBoxes;
  if (!contract) {
    return '';
  }

  return await contract.getAttribute(tokenId);
}

const actions: ActionTree<State, {}> = {
  async loadOffers ({ commit }) {
    const supportedNfts = getSupportedNfts(this.$addresses);

    const offersByNft = await Promise.all(
      Object.entries(supportedNfts).map(async ([nftType, nftAddress]): Promise<Offer[]> => {
        if (!this.$contracts) {
          throw new Error('Contracts not loaded');
        }

        const offerSize = await this.$contracts.marketplace.getOfferOfSize(nftAddress);
        const offers: any[] = await this.$contracts.marketplace.getOfferOfBetweenIndexes(nftAddress, 0, offerSize);

        return Promise.all(offers.map(async (offer): Promise<Offer> => {
          return {
            type: ItemType.Offer,
            nft: {
              owner: offer.owner,
              tokenId: offer.tokenId,
              nftType: nftType as NFTType,
              attribute: await fetchAttribute.call(this, nftType as NFTType, offer.tokenId),
            },
            creationTime: new Date(offer.creationTime.toNumber() * 1000),
            price: offer.price,
          };
        }));
      })
    );

    commit('setOffers', offersByNft.flat());
  },

  async loadAuctions ({ commit }) {
    const supportedNfts = getSupportedNfts(this.$addresses);

    const auctionsByNft = await Promise.all(
      Object.entries(supportedNfts).map(async ([nftType, nftAddress]): Promise<Auction[]> => {
        if (!this.$contracts) {
          throw new Error('Contracts not loaded');
        }
        const auctionSize = await this.$contracts.marketplace.getAuctionOfSize(nftAddress);
        const auctions: any[] = await this.$contracts.marketplace.getAuctionOfBetweenIndexes(nftAddress, 0, auctionSize);

        return Promise.all(auctions.map(async (auction): Promise<Auction> => {
          return {
            type: ItemType.Auction,
            nft: {
              owner: auction.owner,
              tokenId: auction.tokenId,
              nftType: nftType as NFTType,
              attribute: await fetchAttribute.call(this, nftType as NFTType, auction.tokenId),
            },
            creationTime: new Date(auction.creationTime.toNumber() * 1000),
            currentPrice: auction.currentPrice,
            end: new Date(auction.end.toNumber() * 1000),
          };
        }));
      })
    );

    commit('setAuctions', auctionsByNft.flat());
  },

  async load ({ dispatch }) {
    await Promise.all([
      dispatch('loadOffers'),
      dispatch('loadAuctions')
    ]);
  },

  async sellOffer ({ dispatch, rootGetters }, { nftType, tokenId, price }: { nftType: NFTType; tokenId: number; price: number; }) {
    const userAddress = rootGetters['wallet/address'];
    if (!userAddress) {
      throw new Error('User address is not defined');
    }

    const supportedNfts = getSupportedNfts(this.$addresses);
    if (!supportedNfts[nftType]) {
      throw new Error('NFT type is not supported');
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded');
    }

    const tx = await this.$contracts.marketplace.sellOfferItem(
      supportedNfts[nftType],
      tokenId,
      ethers.utils.parseEther(price.toString())
    );

    await tx.wait();
    dispatch('loadOffers');
  },

  async sellAuction ({ dispatch, rootGetters }, { nftType, tokenId, price, end }: { nftType: NFTType; tokenId: number; price: number; end: number; }) {
    const userAddress = rootGetters['wallet/address'];
    if (!userAddress) {
      throw new Error('User address is not defined');
    }

    const supportedNfts = getSupportedNfts(this.$addresses);
    if (!supportedNfts[nftType]) {
      throw new Error('NFT type is not supported');
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded');
    }

    const tx = await this.$contracts.marketplace.sellAuctionItem(
      supportedNfts[nftType],
      tokenId,
      ethers.utils.parseEther(price.toString()),
      end
    );

    await tx.wait();
    dispatch('loadAuctions');
  },

  async loadApproveForNftType ({ commit, rootGetters }, nftType: NFTType) {
    const userAddress = rootGetters['wallet/address'];
    if (!userAddress) {
      commit('resetApprovedForNftType');
      return;
    }

    const nftAddress = getSupportedNfts(this.$addresses)[nftType];
    if (!nftAddress) {
      throw new Error('NFT type is not supported');
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded');
    }

    commit('setApprovedForNftType', {
      nftType,
      isApproved: await this.$contracts.erc721(nftAddress).isApprovedForAll(userAddress, this.$addresses.MarketPlace),
    });
  },

  async approveForNftType ({ dispatch, rootGetters }, nftType: NFTType) {
    const userAddress = rootGetters['wallet/address'];
    if (!userAddress) {
      throw new Error('User address is not defined');
    }

    const nftAddress = getSupportedNfts(this.$addresses)[nftType];
    if (!nftAddress) {
      throw new Error('NFT type is not supported');
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded');
    }

    const tx = await this.$contracts.erc721(nftAddress).setApprovalForAll(this.$addresses.MarketPlace, true);
    await tx.wait();
    dispatch('loadApproveForNftType', nftType);
  },

  async bidAuction ({ dispatch, rootGetters }, { nftType, tokenId, bid }: { nftType: NFTType; tokenId: BigNumber; bid: BigNumber; }) {
    const userAddress = rootGetters['wallet/address'];
    if (!userAddress) {
      throw new Error('User address is not defined');
    }

    const nftAddress = getSupportedNfts(this.$addresses)[nftType];
    if (!nftAddress) {
      throw new Error('NFT type is not supported');
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded');
    }

    const tx = await this.$contracts.marketplace.purchaseAuctionItem(
      nftAddress,
      tokenId,
      bid
    );

    await tx.wait();
    dispatch('loadAuctions');
  },

  async buyNow ({ dispatch, rootGetters }, { nftType, tokenId }: { nftType: NFTType; tokenId: BigNumber; }) {
    const userAddress = rootGetters['wallet/address'];
    if (!userAddress) {
      throw new Error('User address is not defined');
    }

    const nftAddress = getSupportedNfts(this.$addresses)[nftType];
    if (!nftAddress) {
      throw new Error('NFT type is not supported');
    }

    if (!this.$contracts) {
      throw new Error('Contracts not loaded');
    }

    const tx = await this.$contracts.marketplace.purchaseOfferItem(
      nftAddress,
      tokenId
    );

    await tx.wait();
    dispatch('loadOffers');
    dispatch('nft/loadMyNFTs', null, { root: true });
  },

  async recover ({ dispatch, rootGetters }, { nft, type }: { nft: NFT; type: ItemType; }) {
    const userAddress = rootGetters['wallet/address'];
    if (!userAddress) {
      throw new Error('User address is not defined');
    }

    const nftAddress = getSupportedNfts(this.$addresses)[nft.nftType];
    if (!nftAddress) {
      throw new Error('NFT type is not supported');
    }

    const getTx = async () => {
      if (!this.$contracts) {
        throw new Error('Contracts not loaded');
      }

      switch (type) {
        case ItemType.Offer:
          return await this.$contracts.marketplace.recoverOfferItem(
            nftAddress,
            nft.tokenId
          );
        case ItemType.Auction:
          return await this.$contracts.marketplace.recoverAuctionItem(
            nftAddress,
            nft.tokenId
          );
        default:
          throw new Error('Unknown item type');
      }
    };

    const tx = await getTx();
    await tx.wait();
    dispatch('load');
    dispatch('nft/loadMyNFTs', null, { root: true });
  },
};

export default actions;
