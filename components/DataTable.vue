<template>
  <v-card
    class="
      flex flex-col
      flex1
      bg-[#17171B]
      rounded-[12px]
      border-none
      h-[116px]
      mb-[30px]
      md:mb-[0px]
    "
  >
    <v-card-title class="text-[14px] text-[#8a8c8f]">
      <div class="flex">
        <img class="mr-[5px]" :src="_icon" alt="">
        <span class="text-[14px] text-[#FFFFFF]">{{ _title }}</span>
      </div>
    </v-card-title>
    <v-card-text class="pl-[32px]">
      <div
        v-if="_title === `$POLAR Price`"
        class="flex text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ (_price !== null) ? `$${_price}` : '-' }}
        </div>
        <div :class="(_percentage < 0) ? 'text-red-600' : 'text-green-400'">
          {{ (_percentage !== null) ? `${_percentage.toFixed(2)}%` : '-' }}
        </div>
      </div>

      <div
        v-if="_title === `Market Cap`"
        class="flex justify-center text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          ${{ (_price !== null) ? _price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
        </div>
      </div>

      <div
        v-if="_title === `Total Supply`"
        class="flex justify-center text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ (_price !== null) ? _price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
        </div>
      </div>

      <div
        v-if="_title === `Total Nodes`"
        class="flex justify-center text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ (_price !== null) ? _price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
        </div>
      </div>

      <div
        v-if="_title === `My Nodes`"
        class="flex justify-center text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ (_price !== null) ? _price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
        </div>
      </div>

      <div
        v-if="_title === `My $POLAR Balance`"
        class="flex text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ (_price !== null) ? parseFloat(_price).toFixed(2) + ' $POLAR' : '-' }}
        </div>
      </div>

      <div
        v-if="_title === `Daily Rewards`"
        class="flex text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ (_price !== null) ? parseFloat(_price).toFixed(2) + ' $POLAR' : '-' }}
        </div>
      </div>
      <div
        v-if="_title === `Pending Rewards`"
        class="flex text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div>
          <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
            {{ (_price !== null) ? parseFloat(_price).toFixed(4) + ' $POLAR' : '-' }}
          </div>
          <span v-if="_price" class="text-[12px] text-[#FFFFFF]">(including ROI tax)</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import * as eth from 'ethers';
import { BigNumber } from 'ethers';

@Component({
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    price: {
      type: [Number, BigNumber],
    },
    percentage: {
      type: Number,
    },
  },
})
export default class DataTable extends Vue {
  get _title () {
    return this.$props.title;
  }

  get _icon () {
    return this.$props.icon;
  }

  get _price () {
    if (BigNumber.isBigNumber(this.$props.price)) {
      return eth.utils.formatEther(this.$props.price);
    }

    return this.$props.price;
  }

  get _percentage () {
    return this.$props.percentage;
  }
}
</script>
