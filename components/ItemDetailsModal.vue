<template>
  <div
    class="flex flex-col justify-center fixed bg-[#000000da] top-0 right-0 bottom-0 left-0 md:ml-[244px] md:pt-[190px] md:pb-[90px] md:px-[100px]"
  >
    <div
      class="bg-[#00C6ED] text-[white] rounded-t-[20px] text-[18px] md:text-[24px] p-[16px]"
    >
      Buy {{ title }} #{{ tokenId }} NFT 🗻️
      <div class="cursor-pointer inline absolute right-0 md:px-[94px]">
        <v-btn class="mr-[20px]" icon @click="$emit('close')">
          <v-icon class="text-white">
            mdi-close
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div
      class="flex flex-col gap-[20px] bg-[#17171B] rounded-b-[20px] border-solid border-[#00C6ED] border-[2px] p-[20px]"
    >
      <div class="flex flex-wrap md:gap-[64px] mx-[20px] md:mx-[64px] items-center">
        <div class="flex-1 flex-col gap-[16px]">
          <video
            class="flex rounded-[15px] h-[300px] object-cover"
            width="100%"
            height="100%"
            autoplay
            loop
          >
            <source :src="video" type="video/mp4">
          </video>
          <div v-if="nodeData" class="flex flex-col md:mx-[90px] mt-4">
            <div class="flex flex-col gap-[4px] md:gap-[8px]">
              <div class="flex flex-initial text-center items-center">
                <div
                  class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] md:py-[8px] font-[600]"
                >
                  ROI / day:
                </div>
                <div
                  class="justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]"
                >
                  <div class="py-[4px] md:py-[8px]">
                    <span
                      class="text-[white] text-[14px] text-center font-[500]"
                    >{{ roi }}%</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-initial text-center items-center">
                <div
                  class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] md:py-[8px] font-[600]"
                >
                  Claim Tax:
                </div>
                <div
                  class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]"
                >
                  <div class="py-[4px] md:py-[8px]">
                    <span
                      class="text-[white] text-[14px] text-center font-[500]"
                    >{{ claimTax }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 flex-col gap-[8px] md:gap-[43px]">
          <div v-if="isOffer" class="flex flex-initial flex-col gap-[8px] md:gap-[14px]">
            <div class="flex flex-initial text-center items-center">
              <div
                class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] md:py-[8px] font-[600]"
              >
                ‘Buy Now’ Price:
              </div>
              <div
                class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]"
              >
                <div class="py-[4px] md:py-[8px]">
                  <span class="text-[white] text-[14px] mr-[16px] font-[500]">{{ formatEther(price) }}</span>
                  <span class="text-[#00C6ED] text-[14px] font-[600]">$POLAR</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isAuction" class="flex flex-initial flex-col gap-[8px] md:gap-[14px]">
            <div class="flex flex-col gap-[4px] md:gap-[8px]">
              <div class="white--text text-right mr-2">
                Auction End: {{ item.end.toDateString() }}
              </div>

              <div class="flex flex-initial text-center items-center">
                <div
                  class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] md:py-[8px] font-[600]"
                >
                  Current Bid:
                </div>
                <div
                  class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]"
                >
                  <div class="py-[4px] md:py-[8px]">
                    <span class="text-[white] text-[14px] mr-[16px] font-[500]">{{ formatEther(price) }}</span>
                    <span class="text-[#00C6ED] text-[14px] font-[600]">$POLAR</span>
                  </div>
                </div>
              </div>
              <div v-if="!isOwner" class="flex flex-initial text-center items-center">
                <div
                  class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] md:py-[8px] font-[600]"
                >
                  Enter New Bid:
                </div>
                <div
                  class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]"
                >
                  <div class="py-[4px] md:py-[8px]">
                    <input
                      v-model.number="bid"
                      class="text-[white] text-[14px] mr-2 font-[500] w-12"
                      type="number"
                    >
                    <span class="text-[#00C6ED] text-[14px] font-[600]">POLAR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-btn
            v-if="!isApprove"
            class="node-card__outlined pa-2 mt-4"
            dark
            text
            :loading="isBtnLoading"
            @click="() => onApprove()"
          >
            Approve
          </v-btn>
          <v-btn
            v-else-if="isOwner"
            class="node-card__outlined pa-2 mt-4"
            dark
            text
            :loading="isBtnLoading"
            @click="() => onRecover()"
          >
            Recover
          </v-btn>
          <v-btn
            v-else
            class="node-card__outlined pa-2 mt-4"
            dark
            text
            :disabled="!isValidBidPrice && isAuction"
            :loading="isBtnLoading"
            @click="() => isAuction ? onBidAuction() : onBuyNow()"
          >
            {{ isAuction ? 'Bid': 'Buy' }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import * as ethers from 'ethers'
import { NODENAME_TO_VIDEO, LUCKYBOX_VIDEO } from '~/models/constants'
import { NFTType, ItemType } from '~/models/marketplace'
import * as NodeType from '~/models/NodeType'
import WalletReactiveFetch from '~/mixins/wallet-reactive-fetch'

@Component({
  props: {
    item: Object
  },
  watch: {
    price: {
      handler: 'setDefaultPrice'
    }
  },
  transition: 'scale-transition'
})
export default class ItemDetailModal extends WalletReactiveFetch {
  private cardData = []
  private sellGroup: any = [false, false]
  private bid = 100
  private isBtnLoading = false

  get bidBigNumber () {
    return ethers.utils.parseEther(this.bid + '')
  }

  get isValidBidPrice () {
    return this.isAuction && this.bidBigNumber.gt(this.price)
  }

  get nft () {
    return this.$props.item.nft
  }

  get tokenId () {
    return this.nft.tokenId
  }

  get isAuction () {
    return this.$props.item.type === ItemType.Auction
  }

  get isOffer () {
    return this.$props.item.type === ItemType.Offer
  }

  get endDate () {
    return this.isOffer ? this.$props.item.endDate : null
  }

  get nodeData () {
    if (this.nft.nftType !== NFTType.Node) { return null }
    return this.$store.getters['nft/byTokenId'](this.tokenId)
  }

  get luckyBoxData () {
    if (this.nft.nftType !== NFTType.LuckyBox) { return null }
    return this.$store.getters['luckyboxes/byTokenId'](this.tokenId)
  }

  get price () {
    if (this.isOffer) {
      return this.$props.item.price
    } else {
      return this.$props.item.currentPrice
    }
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

  get video () {
    switch (this.nft.nftType) {
      case NFTType.Node:
        return (NODENAME_TO_VIDEO as any)[this.nodeData?.nodeType]
      case NFTType.LuckyBox:
        return LUCKYBOX_VIDEO
    }

    return null
  }

  get nodeType () {
    if (!this.nodeData) { return null }
    return this.$store.getters['nodes/nodeTypeByName'](this.nodeData.nodeType)
  }

  get roi () {
    if (!this.nodeType) { return null }
    return NodeType.roi(this.nodeType).toFixed(2)
  }

  get claimTax () {
    if (!this.nodeType) { return null }
    return this.nodeType.claimTax
  }

  get isOwner () {
    return this.$store.getters['wallet/address'] === this.nft.owner
  }

  setDefaultPrice () {
    if (this.isAuction) {
      this.bid = parseFloat(ethers.utils.formatEther(this.price))
    }
  }

  formatEther (bn: ethers.BigNumber) {
    return parseFloat(ethers.utils.formatEther(bn)).toFixed(2)
  }

  async onBidAuction () {
    try {
      this.isBtnLoading = true
      await this.$store.dispatch('marketplace/bidAuction', {
        nftType: this.nft.nftType,
        tokenId: this.tokenId,
        bid: this.bidBigNumber
      })

      this.$emit('close')
    } finally {
      this.isBtnLoading = false
    }
  }

  async onBuyNow () {
    try {
      this.isBtnLoading = true
      await this.$store.dispatch('marketplace/buyNow', {
        nftType: this.nft.nftType,
        tokenId: this.tokenId
      })

      this.$router.push('/mynft')
    } finally {
      this.isBtnLoading = false
    }
  }

  async onRecover () {
    try {
      this.isBtnLoading = true
      await this.$store.dispatch('marketplace/recover', {
        nft: this.nft,
        type: this.$props.item.type
      })

      this.$router.push('/mynft')
    } finally {
      this.isBtnLoading = false
    }
  }

  get isApprove () {
    return this.isMarketplaceApproved && this.isPolarApproved
  }

  get isMarketplaceApproved () {
    return this.$store.getters['marketplace/isApprovedForNFTType'](this.nft.nftType)
  }

  get isPolarApproved () {
    return this.$store.getters['tokens/hasEnoughMarketplaceAllowance'](this.$store.state.tokens.tokens[0].address, this.price)
  }

  async onApprove () {
    if (this.isApprove) { return }

    try {
      this.isBtnLoading = true
      if (!this.isMarketplaceApproved) {
        await this.$store.dispatch('marketplace/approveForNftType', this.nft.nftType)
      }

      if (!this.isPolarApproved) {
        await this.$store.dispatch('tokens/requestMarketplaceAllowance', this.$store.state.tokens.tokens[0].address)
      }
    } finally {
      this.isBtnLoading = false
    }
  }

  async reactiveFetch () {
    if (this.isWalletConnected) {
      await Promise.all([
        this.$store.dispatch('marketplace/loadApproveForNftType', this.nft.nftType),
        this.$store.dispatch('tokens/loadAllowance', this.$store.state.tokens.tokens[0].address)
      ])
    }
  }

  created () {
    this.setDefaultPrice()
  }
}
</script>
<style>
.v-input--selection-controls .v-input__slot > .v-label,
.v-input--selection-controls .v-radio > .v-label {
  font-size: 16px !important;
  font-weight: 600 !important;
}

.node-card__outlined {
  width: 100%;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  font-size: 16px;
  font-weight: 600;
  background-color: rgba(0, 198, 237, 0);
}

</style>
