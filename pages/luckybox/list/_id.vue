<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[100px]"
  >
    <div class="node-card__header">
      List {{ name }} {{ tokenId ? `#${tokenId}` : '' }} 📦
    </div>
    <div class="flex flex-col justify-center items-center md:gap-[107px] md:flex-row flex-wrap md:mt-[64px] md:mr-[104px] md:ml-[64px] md:mb-[89px] p-[20px] md:p-[0px]">
      <div class="max-w-[420px] max-h-[325px]">
        <video class="node-video" autoplay loop muted>
          <source
            :src="require('../../../assets/PACK/LUCKY_BOX_NEUTRAL_ANIM.mp4')"
            type="video/mp4"
          >
          Your browser does not support the video tag.
        </video>
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
        <v-btn
          class="text-[16px] font-[600] py-[5px] text-center text-white border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] w-full"
          dark
          text
          :disabled="selectedSellMode === null && !isApprove"
          :loading="isBtnLoading"
          @click="() => isApprove ? onApprove() : onList()"
        >
          {{ isApprove ? 'Approve': 'List' }}
        </v-btn>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import * as ethers from 'ethers'
import WalletReactiveFetch, { IReactiveFetch } from '~/mixins/wallet-reactive-fetch'
import { NFTType } from '~/models/marketplace'

@Component({
  watch: {
    luckyBox: {
      handler: 'setDefaultPrices'
    }
  }
})
export default class LuckyboxList extends WalletReactiveFetch implements IReactiveFetch {
  private selectedSellMode: 'fixed' | 'auction' | null = null
  private minimumBid = 100
  private fixedPrice = 100
  private isBtnLoading = false

  setDefaultPrices () {
    if (!this.luckyBox) { return }

    const luckyBoxType = this.$store.getters['luckyboxes/typeByName'](this.luckyBox.type)
    if (!luckyBoxType) { return }
    const defaultPrice = parseFloat(ethers.utils.formatEther(luckyBoxType.price))
    this.minimumBid = this.fixedPrice = defaultPrice
  }

  get isApprove () {
    return !this.$store.getters['marketplace/isApprovedForNFTType'](NFTType.LuckyBox)
  }

  get name () {
    return this.luckyBox?.type
  }

  get tokenId () {
    return this.luckyBox?.tokenId
  }

  get isFixedPrice () {
    return this.selectedSellMode === 'fixed'
  }

  get isAuction () {
    return this.selectedSellMode === 'auction'
  }

  changeSellMode (event: any, mode: 'fixed' | 'auction') {
    this.selectedSellMode = event ? mode : null
  }

  get luckyBox () {
    return this.$store.getters['luckyboxes/byTokenId'](ethers.BigNumber.from(this.$route.params.id))
  }

  async reactiveFetch () {
    if (this.isWalletConnected) {
      await Promise.all([
        this.$store.dispatch('luckyboxes/loadMyLuckyBoxes'),
        this.$store.dispatch('marketplace/loadApproveForNftType', NFTType.LuckyBox)
      ])

      if (!this.luckyBox || this.luckyBox.owner !== this.$store.getters['wallet/isConnected']) {
        this.$router.push('/mynft')
      }
    }
  }

  async onApprove () {
    try {
      this.isBtnLoading = true
      await this.$store.dispatch('marketplace/approveForNftType', NFTType.LuckyBox)
    } finally {
      this.isBtnLoading = false
    }
  }

  async onList () {
    if (!this.selectedSellMode) {
      return
    }

    try {
      this.isBtnLoading = true

      if (this.selectedSellMode === 'fixed') {
        await this.$store.dispatch('marketplace/sellOffer', {
          nftType: NFTType.LuckyBox,
          tokenId: this.tokenId,
          price: this.fixedPrice
        })
      } else {
        await this.$store.dispatch('marketplace/sellAuction', {
          nftType: NFTType.LuckyBox,
          tokenId: this.tokenId,
          price: this.fixedPrice,
          end: ~~(new Date().getTime() / 1000) + 604800 // now + 1 week
        })
      }

      this.$router.push('/market')
    } finally {
      this.isBtnLoading = false
    }
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}

.node-video {
  width: 100%;
  min-width: 150px;
  border-radius: 14px;
  height: 100%;
  object-fit: cover;
}

.node-card {
  width: 90%;
  max-width: 980px;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  background-color: #17171b;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
}

.node-card__odds {
  font-family: WorkSans;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
}

.node-card__header {
  min-height: 60px;
  border-radius: 10px 10px 0px 0px;
  padding: 16px;
  background-color: #00c6ed;
  font-family: WorkSans;
  font-size: 24px;
  font-weight: 600;
}

.node-card__subtitle {
  font-family: WorkSans;
  font-size: 16px;
  font-weight: 500;
}

.node-card__button {
  text-transform: none !important;
}
.node-card__odds__outlined {
  width: 100%;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(0, 198, 237, 0);
}
.node-card__outlined {
  width: 100%;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  font-size: 16px;
  font-weight: 600;
  background-color: rgba(0, 198, 237, 0);
}

.node-card__content {
  width: 200px;
}

.node-card__data-block {
  width: 100%;
  font-size: 14px;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  background-color: rgba(0, 198, 237, 0);
}

.node-card__data-block__blue {
  background-color: #00c6ed;
  font-size: 14px;
  border-radius: 10px 0px 0px 10px;
}
</style>
