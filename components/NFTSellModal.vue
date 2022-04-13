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
      <div class="flex flex-col justify-center items-center gap-2 md:gap-[75px] md:flex-row flex-wrap md:mt-[64px] md:mr-[104px] md:ml-[64px] md:mb-[89px] p-[20px] md:p-[0px]">
        <div class="flex max-w-[420px] max-h-[325px]">
          <video v-if="video" class="node-video" autoplay loop muted>
            <source :src="video" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <v-skeleton-loader
            v-else
            dark
            type="image, image"
            min-width="100%"
            max-height="325px"
          />
        </div>
        <div class="flex flex-col gap-[12px] md:gap-[15px]">
          <div class="border-solid border-[#00C6ED] border-[2px] rounded-[14px] text-center p-[23px]">
            <span class="text-[white] text-[16px] font-[600]">Earning {{ rewardAmount }} $POLAR per day</span>
          </div>
          <div class="flex gap-2 items-center">
            <div class="flex text-center  w-[70%]">
              <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[70%] py-[8px] font-[600]">
                Pending Rewards<br>
                (Including ROI tax)
              </div>
              <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[30%]">
                <div class="p-[10px] md:py-[8px]">
                  <span class="text-[white] text-[14px] font-[500]">{{ formatBigNumber(pendingRewards, 4) }} $POLAR</span>
                </div>
              </div>
            </div>
            <button
              class="text-white text-center font-normal text-[14px] border-solid border-[#57A146] border-[2px] bg-gradient-to-l from-[#3ee3232e] to-[#2ae927] hover:bg-[#57A146]  rounded-[14px] w-[30%]"
            >
              <v-btn
                class="text-[16px] font-[600] py-[8px] text-center"
                dark
                text
                :loading="isClaimBtnLoading"
                @click="onClaim"
              >
                Claim
              </v-btn>
            </button>
          </div>
          <div class="flex flex-col gap-[8px] px-[15%]">
            <div class="flex items-center text-center">
              <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[8px] font-[600]">
                ROI / day:
              </div>
              <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]">
                <div class="px-[4px] py-[8px]">
                  <span class="text-[white] text-[14px] mr-[16px] font-[500]">{{ roi}}%</span>
                </div>
              </div>
            </div>
            <div class="flex items-center text-center">
              <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[8px] font-[600]">
                TAX before ROI
              </div>
              <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]">
                <div class="px-[4px] py-[8px]">
                  <span class="text-[white] text-[14px] mr-[16px] font-[500]">{{ claimTax }}%</span>
                </div>
              </div>
            </div>
            <div class="flex items-center text-center">
              <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[8px] font-[600]">
                Tax after ROI
              </div>
              <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]">
                <div class="px-[4px] py-[8px]">
                  <span class="text-[white] text-[14px] mr-[16px] font-[500]">{{ globalTax }}%</span>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="flex items-center text-center">
            <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] text-[center] w-[50%] py-[8px] font-[600]">
              Minimum Bid:
            </div>
            <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] text-[center] w-[50%]">
              <div class="px-[4px] py-[8px]">
                <span class="text-[white] text-[14px] mr-[16px] font-[500]">100</span>
                <span class="text-[#00C6ED] text-[14px] font-[600]">AVAX</span>
              </div>
            </div>
          </div> -->
          <button
            v-if="canSell"
            class="text-white text-center font-normal text-[14px]  bg-gradient-to-l from-[#231717] to-[#d12929] border-solid border-[#f30000] border-[2px] hover:bg-[#f30303] rounded-[14px]"
            @click="$emit('sellModal')"
          >
            <div class="text-[16px] font-[600] py-[8px] text-center">
              Sell
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import * as ethers from 'ethers';
import axios from 'axios';
import * as NodeType from '~/models/NodeType';
import { NFT } from '~/models/nft';

@Component({
  props: {
    nft: Object as () => NFT,
  },
})
export default class NFTSellModal extends Vue {
  public isClaimBtnLoading = false;
  public video = null;

  async mounted () {
    const { $props: { nft } } = this;
    const tokenId = parseInt(nft.tokenId);

    const { data } = await axios.get(`https://api.polar.financial/node/${tokenId}`);
    this.video = data.animation_url;    
  }

  get nodeType () {
    return this.$store.getters['nodes/nodeTypeByName'](this.$props.nft.nodeType);
  }

  get rewardAmount () {
    const rt = (10000 + this.$store.getters['nft/spROI'])/10000 
    return rt ? (this.formatBigNumber(NodeType.dailyRewardPerNode(this.nodeType)) as any * rt).toFixed(2) : this.formatBigNumber(NodeType.dailyRewardPerNode(this.nodeType))
  }

  get pendingRewards () {
    return this.$props.nft?.userPendingRewards ?? ethers.BigNumber.from(0);
  }

  get claimTax () {
    return this.nodeType.claimTax;
  }
  
  get globalTax () {
    return this.nodeType.globalTax;
  }

  get roi () {
    const rt = this.$store.getters['nft/spROI'] ? this.$store.getters['nft/spROI']/10000 : 0
    return this.$props.nft.attribute != "" ? (NodeType.roi(this.nodeType) + NodeType.roi(this.nodeType) * rt).toFixed(2) : NodeType.roi(this.nodeType).toFixed(2);
  }

  get canSell () {
    return this.$props.nft.attribute !== '';
  }

  async onClaim () {
    try {
      this.isClaimBtnLoading = true;
      await this.$store.dispatch('nft/claimRewards', [this.$props.nft]);
    } finally {
      this.isClaimBtnLoading = false;
    }
  }

  formatBigNumber (bn: unknown, decimals = 2) {
    if (ethers.BigNumber.isBigNumber(bn)) {
      return parseFloat(ethers.utils.formatEther(bn)).toFixed(decimals);
    }

    return bn;
  }

}
</script>
<style>
  .v-input--selection-controls .v-input__slot > .v-label, .v-input--selection-controls .v-radio > .v-label {
    font-size:16px !important;
    font-weight: 600 !important;

  }
</style>
