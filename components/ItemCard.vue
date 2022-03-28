<template>
  <div
    v-if="loading"
    class="md:flex flex-col md:flex-wrap bg-[#17171B] border-solid border-[#00C6ED] border-[1px] rounded-[14px] p-[15px] nftCard"
  >
    <div class="flex border-solid border-gray-200 border-[2px] mr-[5px] rounded-[14px] height-[140px]">
      <div
        class="animate-pulse bg-gray-400 h-[140px] w-[140px] rounded-[14px]"
      />
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
      </div>
    </div>
  </div>
  <div
    v-else
    class="md:flex flex-col md:flex-wrap bg-[#17171B] border-solid border-[#00C6ED] border-[1px] rounded-[14px] p-[15px] nftCard"
    @click="$emit('click', value)"
  >
    <div class="border-solid border-[#00C6ED] border-[2px] rounded-[14px]">
      <div
        v-if="!image"
        class="animate-pulse bg-gray-400 h-[140px] w-[140px] rounded-[14px]"
      />
      <img
        v-else
        class="object-cover mr-[5px] rounded-[14px] height-[140px] aspect-square"
        :src="image"
        :alt="title"
      >
    </div>
    <div class="text-[white] text-[16px] mt-[16px]">
      {{ title }} #{{ tokenId }}
    </div>
    <div class="flex justify-between mt-[16px]">
      <div v-if="isOffer" class="flex flex-col">
        <span class="text-[#00C6ED] text-[12px]">Buy Now</span>
        <span class="text-[white] text-[16px]">{{ displayPrice }} $POLAR</span>
      </div>
      <div v-if="isAuction" class="flex flex-col">
        <span class="text-[#00C6ED] text-[12px]">Current Bid</span>
        <span class="text-[white] text-[16px]">{{ displayPrice }} $POLAR</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as ethers from 'ethers'
import { NODENAME_TO_IMAGE, LUCKYBOX_IMAGE } from '~/models/constants'
import { NFTType } from '~/models/marketplace'

@Component({
  props: {
    item: Object
  }
})
export default class ItemCard extends Vue {
  private loading = true

  get tokenId () {
    return this.$props.item.nft.tokenId
  }

  get isAuction () {
    return this.$props.item.type === 'auction'
  }

  get isOffer () {
    return this.$props.item.type === 'offer'
  }

  get endDate () {
    return null
  }

  get displayPrice () {
    const price = (this.isAuction)
      ? this.$props.item.currentPrice
      : (this.isOffer)
          ? this.$props.item.price
          : null

    if (!price) { return null }
    return parseFloat(ethers.utils.formatEther(price)).toFixed(2)
  }

  get nft () {
    return this.$props.item.nft
  }

  get nodeData () {
    return this.$store.getters['nft/byTokenId'](this.tokenId)
  }

  get luckyBoxData () {
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

  async created () {
    if (!this.nft) { return }
    const nftType = this.nft.nftType

    switch (nftType) {
      case NFTType.Node:
        await this.$store.dispatch('nft/loadByTokenId', this.nft.tokenId)
        break
      case NFTType.LuckyBox:
        await this.$store.dispatch('luckyboxes/loadByTokenId', this.nft.tokenId)
        break
      default:
        throw new Error(`Unsupported NFT Type ${nftType}`)
    }

    this.loading = false
  }

  get image () {
    if (this.loading) { return }

    switch (this.nft.nftType) {
      case NFTType.Node:
        return NODENAME_TO_IMAGE[this.nodeData?.nodeType]
      case NFTType.LuckyBox:
        return LUCKYBOX_IMAGE
    }

    return null
  }
}
</script>

<style scoped>
.nftCard:hover {
  box-shadow: 0 0 14px 14px rgba(0, 198, 237, 0.5);
}
.nftCard {
  cursor: pointer;
}
</style>
