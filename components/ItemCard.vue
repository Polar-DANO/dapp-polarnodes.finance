<template>
  <div
    v-if="loading"
    class="md:flex flex-col md:flex-wrap bg-[#17171B] border-solid border-[#00C6ED] border-[1px] rounded-[14px] p-[15px] nftCard"
  >
    <div
      class="flex border-solid border-gray-200 border-[2px] mr-[5px] rounded-[14px] height-[140px]"
      style="min-height: 200px"
    >
      <div class="animate-pulse bg-gray-400 h-[100%] w-[100%] rounded-[14px]" />
    </div>
    <div class="text-[white] text-[16px] mt-[16px]">
      <div class="animate-pulse w-24 bg-gray-400 h-2 rounded-md" />
    </div>
    <div class="flex justify-between mt-[16px]">
      <div class="flex flex-col">
        <span class="text-[#00C6ED] text-[12px]">
          <div class="animate-pulse w-12 bg-[#00C6ED] h-2 rounded-md my-1" />
          <div class="animate-pulse w-16 bg-gray-400 h-2 rounded-md my-1" />
        </span>
        <span class="text-[#00C6ED] text-[12px]">
          <div class="animate-pulse w-12 bg-[#00C6ED] h-2 rounded-md my-1" />
          <div class="animate-pulse w-16 bg-gray-400 h-2 rounded-md my-1" />
        </span>
      </div>
    </div>
  </div>
  <div
    v-else
    class="md:flex flex-col md:flex-wrap bg-[#17171B] border-solid border-[#00C6ED] border-[1px] rounded-[14px] p-[15px] nftCard"
    @click="$emit('click', item)"
  >
    <div
      class="border-solid border-[#00C6ED] border-[2px] rounded-[14px]"
      style="min-height: 200px"
    >
      <div
        v-if="!image"
        class="animate-pulse bg-gray-400 h-[100%] w-[100%] rounded-[14px]"
      />
      <img
        v-else
        class="object-cover mr-[5px] rounded-[14px] height-[100%] aspect-square my-auto"
        style="object-fit: cover; height: 100%"
        :src="image"
        :alt="title"
      />
    </div>
    <div class="text-[white] text-[16px] mt-[16px]">
      {{ title }} #{{ tokenId }}
    </div>
    <div class="flex justify-between mt-[16px]">
      <div v-if="isOffer" class="flex flex-col">
        <span class="text-[#00C6ED] text-[14px]">
          <v-icon small color="#00C6ED">mdi-cart-check</v-icon>
          Buy Now
        </span>
        <span class="text-[white] text-[16px]">{{ displayPrice }} $POLAR</span>
      </div>
      <div v-if="isAuction" class="flex flex-col">
        <span class="text-[#00C6ED] text-[14px]">
          <v-icon small color="#00C6ED">mdi-tag-outline</v-icon>
          Current Bid
        </span>
        <span class="text-[white] text-[16px]">{{ displayPrice }} $POLAR</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import * as ethers from 'ethers'
import { NODENAME_TO_IMAGE, LUCKYBOX_IMAGE } from '~/models/constants'
import { NFTType, ItemType } from '~/models/marketplace'
import WalletReactiveFetch, {
  IReactiveFetch
} from '~/mixins/wallet-reactive-fetch'

@Component({
  props: {
    item: Object
  }
})
export default class ItemCard
  extends WalletReactiveFetch
  implements IReactiveFetch {
  private loading = true

  get isAuction () {
    return this.$props.item.type === ItemType.Auction
  }

  get isOffer () {
    return this.$props.item.type === ItemType.Offer
  }

  get displayPrice () {
    const price = this.isAuction
      ? this.$props.item.currentPrice
      : this.isOffer
        ? this.$props.item.price
        : null

    if (!price) {
      return null
    }
    return parseFloat(ethers.utils.formatEther(price)).toFixed(2)
  }

  get nft () {
    return this.$props.item.nft
  }

  get tokenId () {
    return this.nft.tokenId
  }

  get nodeData () {
    if (this.nft.nftType !== NFTType.Node) {
      return null
    }
    return this.$store.getters['nft/byTokenId'](this.tokenId)
  }

  get luckyBoxData () {
    if (this.nft.nftType !== NFTType.LuckyBox) {
      return null
    }
    return this.$store.getters['luckyboxes/byTokenId'](this.tokenId)
  }

  get title () {
    switch (this.nft.nftType) {
      case NFTType.LuckyBox:
        return this.luckyBoxData?.type
      case NFTType.Node:
        return this.nodeData?.nodeType
      default:
        return null
    }
  }

  async reactiveFetch () {
    /*if (!this.isWalletConnected) {
      this.loading = true
      return
    }*/

    const nftType = this.nft.nftType

    switch (nftType) {
      case NFTType.Node:
        await this.$store.dispatch('nft/loadByTokenId', this.tokenId)
        break
      case NFTType.LuckyBox:
        await this.$store.dispatch('luckyboxes/loadByTokenId', this.tokenId)
        break
      default:
        throw new Error(`Unsupported NFT Type ${nftType}`)
    }

    this.loading = false
  }

  get image () {
    if (this.loading) {
      return
    }

    switch (this.nft.nftType) {
      case NFTType.Node:
        return (NODENAME_TO_IMAGE as any)[this.nodeData?.nodeType]
      case NFTType.LuckyBox:
        return LUCKYBOX_IMAGE
    }

    return null
  }
}
</script>

<style scoped>
@media screen and (min-width: 1024px) {
  .nftCard {
    flex-grow: 0;
  }
}

@media screen and (max-width: 1023px) {
  .nftCard {
    flex-grow: 1;
  }
}

@media screen and (max-width: 425px) {
  .nftCard {
    margin-bottom: 8px;
  }
}

.nftCard:hover {
  box-shadow: 0 0 14px 14px rgba(0, 198, 237, 0.5);
}
.nftCard {
  width: 200px;
  cursor: pointer;
}
</style>
