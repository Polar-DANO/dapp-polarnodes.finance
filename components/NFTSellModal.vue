<template>
  <div class="flex flex-col justify-center fixed bg-[#000000da] top-0 right-0 bottom-0 left-0 md:ml-[244px] py-[30%] md:py-[13%] px-[3%]">
    <div class="bg-[#00C6ED] text-[white] rounded-t-[20px] text-[18px] md:text-[24px] p-[16px]">
      Sell Fuji Mountain #123 NFT 🗻️
      <div class="cursor-pointer inline absolute right-0 md:px-[3%]">
        <v-btn class="mr-[20px]" icon @click="$emit('closeSellModal')">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="flex flex-col  md:flex-row flex-wrap justify-between md:p-[5%] bg-[#17171B] rounded-b-[20px] border-solid border-[#00C6ED] border-[2px]">
      <img class="md:ml-[5px] my-[30px] md:mt-[0px] px-[10px] md:px-[0px]  rounded-[15px] h-[245px] md:w-[40%]" :src="require('../assets/img/nft/3.jpg')" alt=""/>
      <div class="flex flex-col gap-[12px] md:gap-[24px] px-[16%] md:px-[13%] pb-[14px]">
        <div class="border-solid border-[#00C6ED] border-[2px] rounded-[14px] text-center p-[23px]">
          <span class="text-[white] text-[16px] font-[600]">Earning 0.45 $POLAR per day</span>
        </div>
        <div class="flex gap-2 items-center">
          <div class="flex text-center  w-[70%]">
            <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[70%] py-[4px] font-[600]">
              Pending Rewards:
            </div>
            <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[30%]">
              <div class="p-[10px] md:py-[4px]">
                <span class="text-[white] text-[14px] font-[500]">500</span>
              </div>
            </div>
          </div>
          <button
            class="text-white text-center font-normal text-[14px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] h-[53px] md:h-[35px] w-[28%]"
            @click="$emit('sellModal')"
          >
            <div class="text-[16px] font-[600] py-[5px] text-center">Claim</div>
          </button>
        </div>
        <div class="flex flex-col gap-[8px] px-[15%]">
          <div class="flex items-center text-center">
            <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] font-[600]">
              ROI / day:
            </div>
            <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]">
              <div class="px-[4px] py-[4px]">
                <span class="text-[white] text-[14px] mr-[16px] font-[500]">1.5%</span>
              </div>
            </div>
          </div>
          <div class="flex items-center text-center">
            <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] font-[600]">
              Claim Tax:
            </div>
            <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]">
              <div class="px-[4px] py-[4px]">
                <span class="text-[white] text-[14px] mr-[16px] font-[500]">1%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center text-center">
          <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] text-[center] w-[50%] py-[4px] font-[600]">
            Minimum Bid:
          </div>
          <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] text-[center] w-[50%]">
            <div class="px-[4px] py-[4px]">
              <span class="text-[white] text-[14px] mr-[16px] font-[500]">100</span>
              <span class="text-[#00C6ED] text-[14px] font-[600]">AVAX</span>
            </div>
          </div>
        </div>
        <button
          class="text-white text-center font-normal text-[14px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] h-[35px]"
          @click="$emit('sellModal')"
        >
          <div class="text-[16px] font-[600] py-[5px] text-center">Sell</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class NFTSellModal extends Vue {
}
</script>
<style>
  .v-input--selection-controls .v-input__slot > .v-label, .v-input--selection-controls .v-radio > .v-label {
    font-size:16px !important;
    font-weight: 600 !important;
    
  }
</style>