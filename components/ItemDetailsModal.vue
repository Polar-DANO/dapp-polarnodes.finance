<template>
  <div
    class="flex flex-col justify-center fixed bg-[#000000da] top-0 right-0 bottom-0 left-0 md:ml-[244px] md:pt-[190px] md:pb-[90px] md:px-[100px]"
  >
    <div
      class="bg-[#00C6ED] text-[white] rounded-t-[20px] text-[18px] md:text-[24px] p-[16px]"
    >
      Buy Fuji Mountain #123 NFT 🗻️
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
      <div class="text-[white] text-[16px] text-center">
        Create a Mountain NFT with $POLAR tokens to earn lifetime high-yield
        token rewards!
      </div>
      <div class="flex flex-wrap md:gap-[64px] mx-[20px] md:mx-[64px]">
        <div class="flex flex-col gap-[16px]">
          <video
            class="rounded-[15px] max-h-[300px] object-cover"
            width="100%"
            height="100%"
            autoplay
            loop
          >
            <source :src="cardData.video" type="video/mp4">
          </video>
          <div class="flex flex-col md:mx-[90px]">
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
                    >1.5%</span>
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
                    >1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-[8px] md:gap-[43px]">
          <div class="flex flex-initial flex-col gap-[8px] md:gap-[14px]">
            <v-checkbox
              v-model="sellGroup[0]"
              class="text-[16px] font-[16px]"
              label="Fixed Price"
              color="#00C6ED"
              hide-details
              @change="uniqueCheck($event, 0)"
            />
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
                  <span class="text-[white] text-[14px] mr-[16px] font-[500]">100</span>
                  <span class="text-[#00C6ED] text-[14px] font-[600]">POLAR</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-initial flex-col gap-[8px] md:gap-[14px]">
            <v-checkbox
              v-model="sellGroup[1]"
              label="Auction"
              color="#00C6ED"
              hide-details
              @change="uniqueCheck($event, 1)"
            />
            <div class="flex flex-col gap-[4px] md:gap-[8px]">
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
                    <span class="text-[white] text-[14px] mr-[16px] font-[500]">100</span>
                    <span class="text-[#00C6ED] text-[14px] font-[600]">POLAR</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-initial text-center items-center">
                <div
                  class="bg-[#00C6ED] border-solid border-[#00C6ED] border-[2px] rounded-l-[16px] text-[white] text-[14px] w-[50%] py-[4px] md:py-[8px] font-[600]"
                >
                  Enter New Bid:
                </div>
                <div
                  class="flex justify-center border-solid border-[#00C6ED] border-[2px] rounded-r-[16px] text-[white] text-[14px] w-[50%]"
                >
                  <div class="py-[4px] md:py-[8px]">
                    <span class="text-[white] text-[14px] mr-[16px] font-[500]">100</span>
                    <span class="text-[#00C6ED] text-[14px] font-[600]">POLAR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            class="text-white text-center font-normal text-[14px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px]"
          >
            <div class="text-[16px] font-[600] py-[8px] text-center">
              Buy
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  props: {
    dataDetail: Array
  },
  transition: 'scale-transition'
})
export default class CardDetailModal extends Vue {
  private cardData = []
  private sellGroup: any = [false, false]

  private uniqueCheck (e: any, index: number) {
    if (e === true) {
      this.sellGroup[0] = false
      this.sellGroup[1] = false
      this.sellGroup[index] = true
    }
  }

  private created () {
    this.cardData = this.$props.dataDetail
  }
}
</script>
<style>
.v-input--selection-controls .v-input__slot > .v-label,
.v-input--selection-controls .v-radio > .v-label {
  font-size: 16px !important;
  font-weight: 600 !important;
}
</style>
