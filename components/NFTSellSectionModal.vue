<template>
  <div class="flex flex-col justify-center fixed bg-[#000000da] top-0 right-0 bottom-0 left-0 md:ml-[244px] md:pt-[190px] md:pb-[90px] md:px-[100px]">
    <div class="bg-[#00C6ED] text-[white] rounded-t-[20px] text-[18px] md:text-[24px] p-[16px]">
      Sell {{ nft.nodeType }} #{{ nft.tokenId }} NFT 🗻️
      <div class="cursor-pointer inline absolute right-0 md:px-[100px]">
        <v-btn class="mr-[20px]" icon @click="$emit('closeModal')">
          <v-icon class="text-white">
            mdi-close
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div class="bg-[#17171B] rounded-b-[20px] border-solid border-[#00C6ED] border-[2px]">
      <div class="flex flex-col justify-center items-center md:gap-[107px] md:flex-row flex-wrap md:mt-[64px] md:mr-[104px] md:ml-[64px] md:mb-[89px] p-[20px] md:p-[0px]">
        <div class="max-w-[420px] max-h-[325px]">
          <img class="rounded-[15px] w-[420px] h-[325px] object-cover" :src="require('../assets/img/nft/3.jpg')" alt="">
        </div>
        <div class="flex flex-col gap-[20px] md:gap-[48px] w-[70%] md:w-[0]">
          <div class="flex flex-initial flex-col gap-[15px]">
            <v-checkbox
              :value="isFixedPrice"
              class="text-[16px] font-[16px]"
              label="Fixed Price"
              color="#00C6ED"
              hide-details
              @change="changeSellMode($event, 'fixed')"
            />
            <div class="flex flex-initial items-center text-center">
              <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[8px] font-[600]">
                ‘Buy Now’ Price:
              </div>
              <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%] px-[4px] py-[8px]">
                <input
                  v-model.number="fixedPrice"
                  class="text-[white] text-[14px] mr-2 font-[500] w-12"
                  type="number"
                  @change="() => changeSellMode(true, 'fixed')"
                >
                <span class="text-[#00C6ED] text-[14px] font-[600]">$POLAR</span>
              </div>
            </div>
          </div>
          <div class="flex flex-initial flex-col gap-[15px]">
            <v-checkbox
              :value="isAuction"
              label="Auction"
              color="#00C6ED"
              hide-details
              @change="changeSellMode($event, 'auction')"
            />
            <div class="flex flex-initial items-center text-center">
              <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] text-[center] w-[50%] py-[8px] font-[600]">
                Minimum Bid:
              </div>
              <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] text-[center] w-[50%] px-[4px] py-[8px]">
                <input
                  v-model.number="minimumBid"
                  class="text-[white] text-[14px] mr-2 font-[500] w-12"
                  type="number"
                  @change="() => changeSellMode(true, 'auction')"
                >
                <span class="text-[#00C6ED] text-[14px] font-[600]">$POLAR</span>
              </div>
            </div>
          </div>
          <button
            class="text-white text-center font-normal text-[14px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px]"
          >
            <v-btn
              class="text-[16px] font-[600] py-[5px] text-center"
              dark
              text
              :disabled="selectedSellMode === null"
              :loading="isListBtnLoading"
              @click="onList"
            >
              List
            </v-btn>
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  props: {
    nft: Object
  }
})
export default class NFTSellSectionModal extends Vue {
  private selectedSellMode: 'fixed' | 'auction' | null = null
  private minimumBid = 100
  private fixedPrice = 100
  private isListBtnLoading = false

  get isFixedPrice () {
    return this.selectedSellMode === 'fixed'
  }

  get isAuction () {
    return this.selectedSellMode === 'auction'
  }

  changeSellMode (event: any, mode: 'fixed' | 'auction') {
    this.selectedSellMode = event ? mode : null
  }

  async onList () {
    if (!this.selectedSellMode) {
      return
    }

    try {
      this.isListBtnLoading = true

      if (this.selectedSellMode === 'fixed') {
        await this.$store.dispatch('marketplace/sellOffer', {
          nftType: this.nft.nodeType,
          tokenId: this.nft.tokenId,
          price: this.fixedPrice
        })
      } else {
        await this.$store.dispatch('marketplace/sellAuction', {
          nftType: this.nft.nodeType,
          tokenId: this.nft.tokenId,
          price: this.fixedPrice,
          end: ~~(new Date().getTime() / 1000) + 604800 // now + 1 week
        })
      }

      this.$router.push('/market')
    } finally {
      this.isListBtnLoading = false
    }
  }
}
</script>
<style>
  .v-input--selection-controls .v-input__slot > .v-label, .v-input--selection-controls .v-radio > .v-label {
    font-size:16px !important;
    font-weight: 600 !important;

  }
</style>
