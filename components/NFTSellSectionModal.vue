<template>
  <div class="flex flex-col justify-center fixed bg-[#000000da] top-0 right-0 bottom-0 left-0 md:ml-[244px] md:pt-[190px] md:pb-[90px] md:px-[100px]">
    <div class="bg-[#00C6ED] text-[white] rounded-t-[20px] text-[18px] md:text-[24px] p-[16px]">
      Sell {{ nft.nodeType }} {{ nft.attribute }} #{{ nft.tokenId }} NFT 🗻️
      <div class="cursor-pointer inline absolute right-0 md:px-[100px]">
        <v-btn class="mr-[20px]" icon @click="$emit('closeSellModal')">
          <v-icon class="text-white">
            mdi-close
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div class="bg-[#17171B] rounded-b-[20px] border-solid border-[#00C6ED] border-[2px]">
      <div v-if="video && minimumBid && fixedPrice" class="flex flex-col justify-center items-center md:gap-[107px] md:flex-row flex-wrap md:mt-[64px] md:mr-[104px] md:ml-[64px] md:mb-[89px] p-[20px] md:p-[0px]">
        <div class="flex max-w-[420px] max-h-[325px]">
          <video class="node-video" autoplay loop muted>
            <source :src="video" type="video/mp4">
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
            <v-menu
              v-if="isAuction"
              v-model="datepickerMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
              dark
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFormatted"
                  dark
                  clearable
                  label="Auction end date"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  @blur="date = parseDate(dateFormatted)"
                  @click:clear="date = null"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="date"
                no-title
                :min="isoToday"
                @input="datepickerMenu = false"
              />
            </v-menu>
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
            {{ isApprove ? 'Approve' : 'List' }}
          </v-btn>
        </div>
      </div>
      <div v-else style="min-height: 450px" class="d-flex align-stretch justify-center pa-8">
        <v-skeleton-loader
          dark
          type="image, image"
          width="100%"
          max-height="400px"
        />
        <v-skeleton-loader
          dark
          type="article, article, article"
          width="100%"
          max-height="400px"
        />
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import axios from 'axios';
import * as ethers from 'ethers';
import WalletReactiveFetch, { IReactiveFetch } from '~/mixins/wallet-reactive-fetch';
import { NFTType } from '~/models/marketplace';

@Component({
  props: {
    nft: Object,
  },
})
export default class NFTSellSectionModal extends WalletReactiveFetch implements IReactiveFetch {
  public minimumBid: number | null = null;
  public fixedPrice: number | null = null;
  public video: string | null = null;
  public selectedSellMode: 'fixed' | 'auction' | null = null;
  public isBtnLoading = false;
  public date: string | null = null;
  public datepickerMenu = false;

  async mounted () {
    const { $props: { nft } } = this;
    const tokenId = parseInt(nft.tokenId);

    const { data } = await axios.get(`https://api.polar.financial/node/${tokenId}`);

    const weiFixedPrice = data.attributes.find((att: Record<string, string>) => att.trait_type === 'Min Offer Price');
    const weiAuctionPrice = data.attributes.find((att: Record<string, string>) => att.trait_type === 'Min Auction Price');

    this.video = data.animation_url;

    if (weiFixedPrice) {
      const minFixedPrice = ethers.utils.formatEther(weiFixedPrice.value);
      this.fixedPrice = parseInt(minFixedPrice);
    }
    if (weiAuctionPrice) {
      const minAuctionPrice = ethers.utils.formatEther(weiAuctionPrice.value);
      this.minimumBid = parseInt(minAuctionPrice);
    }
  }

  get dateFormatted (): string | null {
    const { date, formatDate } = this;

    if (!date) {
      return null;
    }
    return formatDate(date);
  }

  get isoToday (): string {
    return new Date().toISOString();
  }

  get nodeType () {
    return this.$store.getters['nodes/nodeTypeByName'](this.$props.nft.nodeType);
  }

  formatDate (date: string | null): string | null {
    if (!date) { return null; }

    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
  }

  parseDate (date: string | null): string | null {
    if (!date) { return null; }

    const [month, day, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  async reactiveFetch () {
    if (this.isWalletConnected) {
      await Promise.all([
        this.$store.dispatch('marketplace/loadApproveForNftType', NFTType.Node)
      ]);
    }
  }

  get isApprove () {
    if (!this?.nft?.nodeType) { return false; }
    return !this.$store.getters['marketplace/isApprovedForNFTType'](NFTType.Node);
  }

  get isFixedPrice () {
    return this.selectedSellMode === 'fixed';
  }

  get isAuction () {
    return this.selectedSellMode === 'auction';
  }

  changeSellMode (event: any, mode: 'fixed' | 'auction') {
    this.selectedSellMode = event ? mode : null;
  }

  async onApprove () {
    try {
      this.isBtnLoading = true;
      await this.$store.dispatch('marketplace/approveForNftType', NFTType.Node);
    } finally {
      this.isBtnLoading = false;
    }
  }

  async onList () {
    if (!this.selectedSellMode) {
      return;
    }

    try {
      this.isBtnLoading = true;

      if (this.selectedSellMode === 'fixed') {
        await this.$store.dispatch('marketplace/sellOffer', {
          nftType: NFTType.Node,
          tokenId: this.nft.tokenId,
          price: this.fixedPrice,
        });
      } else {
        await this.$store.dispatch('marketplace/sellAuction', {
          nftType: NFTType.Node,
          tokenId: this.nft.tokenId,
          price: this.minimumBid,
          end: this.date
            ? ~~(new Date(this.date).getTime() / 1000)
            : ~~(new Date().getTime() / 1000) + 604800, // now + 1 week
        });
      }

      this.$router.push('/market');
    } finally {
      this.isBtnLoading = false;
    }
  }
}
</script>
<style>
  .v-input--selection-controls .v-input__slot > .v-label, .v-input--selection-controls .v-radio > .v-label {
    font-size:16px !important;
    font-weight: 600 !important;

  }

.node-video {
  width: 100%;
  height: 300px;
  border-radius: 14px;
  object-fit: cover;
}
</style>
