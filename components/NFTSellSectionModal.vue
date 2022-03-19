<template>
  <div class="flex flex-col justify-center fixed bg-[#000000da] top-0 right-0 bottom-0 left-0 md:ml-[244px] py-[30%] md:py-[13%] px-[3%]">
    <div class="bg-[#00C6ED] text-[white] rounded-t-[20px] text-[18px] md:text-[24px] p-[16px]">
      Sell Fuji Mountain #123 NFT 🗻️
      <div class="cursor-pointer inline absolute right-0 md:px-[3%]">
        <v-btn class="mr-[20px]" icon @click="$emit('closeModal')">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="flex  flex-col bg-[#17171B] rounded-b-[20px] border-solid border-[#00C6ED] border-[2px]">
      <div class="flex flex-col md:flex-row flex-wrap justify-between md:p-[5%]">
        <img class="md:ml-[5px] my-[30px] md:mt-[0px] px-[10px] md:px-[0px]  rounded-[15px] h-[245px]  md:w-[40%]" :src="require('../assets/img/nft/3.jpg')" alt=""/>
        <div class="flex flex-col gap-[20px] md:gap-[51px] px-[16%] md:px-[13%]  md:mt-[10px] pb-[20px] md:pb-[0px]">
          <div class="flex flex-col gap-[15px]">
            <v-checkbox
              class="text-[16px] font-[16px]"
              label="Fixed Price"    
              color="#00C6ED"
              hide-details
              v-model="sellGroup[0]"
              @change="uniqueCheck($event, 0)"
            ></v-checkbox>
            <div class="flex items-center text-center">
              <div class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] font-[600]">
                ‘Buy Now’ Price:
              </div>
              <div class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]">
                <div class="px-[4px] py-[4px]">
                  <span class="text-[white] text-[14px] mr-[16px] font-[500]">100</span>
                  <span class="text-[#00C6ED] text-[14px] font-[600]">POLAR</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-[15px]">
            <v-checkbox
              label="Auction"      
              color="#00C6ED"
              hide-details
              v-model="sellGroup[1]"
              @change="uniqueCheck($event, 1)"
            ></v-checkbox>
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
          </div>
          <button
            class="text-white text-center font-normal text-[14px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px]"
            @click="$emit('sellModal')"
          >
            <div class="text-[16px] font-[600] py-[5px] text-center">List</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { mapGetters } from "vuex";

@Component
export default class NFTSellSectionModal extends Vue {

  private sellGroup:any = [false, false];

  private uniqueCheck(e:any, index: number ) {
    if (e === true) {
      this.sellGroup[0] = false;
      this.sellGroup[1] = false;
      this.sellGroup[index] = true;
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