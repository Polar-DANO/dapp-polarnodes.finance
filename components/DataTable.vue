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
        <img class="mr-[5px]" :src="_icon" alt="" />
        <span class="text-[14px] text-[#FFFFFF]">{{ _title }}</span>
      </div>
    </v-card-title>
    <v-card-text class="pl-[32px]">
      <div
        v-if="_title == `$POLAR Price`"
        class="flex text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">${{ price }}</div>
        <div v-if="parseFloat(percentage) < 0" class="text-red-600">
          {{ percentage }}%
        </div>
        <div v-if="parseFloat(percentage) >= 0" class="text-green-400">
          {{ percentage }}%
        </div>
      </div>

      <div
        v-if="_title == `Market Cap`"
        class="flex justify-center text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          ${{ price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </div>
      </div>

      <div
        v-if="_title == `Total Supply`"
        class="flex justify-center text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </div>
      </div>

      <div
        v-if="_title == `Total Nodes`"
        class="flex justify-center text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </div>
      </div>

      <div
        v-if="_title == `My Nodes`"
        class="flex justify-center text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </div>
      </div>

      <div
        v-if="_title == `My $POLAR Balance`"
        class="flex text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ price }} POLAR
        </div>
      </div>

      <div
        v-if="_title == `Daily Rewards`"
        class="flex text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
          {{ price }} POLAR
        </div>
      </div>
      <div
        v-if="_title == `Pending Rewards`"
        class="flex text-[24px] text-[#FFFFFF] mr-[16px]"
      >
        <div>
          <div class="text-[24px] text-[#FFFFFF] mr-[16px]">
            {{ price }} POLAR
          </div>
          <!-- <span class="text-[12px] text-[#FFFFFF]">(including ROI tax)</span> -->
        </div>
      </div>

      <!-- <div v-if="_title==`Circulating Supply` || _title==`My Nodes`" class="flex justify-center">
             <div class="text-[24px] text-[#FFFFFF] mr-[16px]">{{price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
             <div v-if="_title ==`$POLAR Price` || _title ==`Market Cap` || _title==`Total Nodes`" class="text-[14px] text-[#29BB89] pt-[3px]">
              <div v-if="parseInt(_percentage)< 0" class="text-red-600">{{percentage}}%</div>
              <div v-if="parseInt(_percentage) > 0" class="text-green-400">+{{percentage}}%</div>
             </div>
          </div>
          <div v-else class="flex">
             <div v-if="_title==`Total Nodes`" class="text-[24px] text-[#FFFFFF] mr-[16px]">{{price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
             <div v-if="_title==`My $POLAR Balance`" class="text-[24px] text-[#FFFFFF] mr-[16px]">{{price}}</div>
             <div v-else class="text-[24px] text-[#FFFFFF] mr-[16px]">${{price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</div>
              <div v-if="_title ==`$POLAR Price` || _title ==`Market Cap` || _title==`Total Nodes`" class="text-[14px] text-[#29BB89] pt-[3px]">
                <div v-if="parseInt(_percentage) < 0" class="text-red-600">{{percentage}}%</div>
                <div v-if="parseInt(_percentage) > 0" class="text-green-400">+{{percentage}}%</div>
             </div>
          </div> -->
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({
  props: {
    title: { type: String },
    icon: { type: String },
    price: { type: String },
    percentage: { type: String },
  },
})
export default class DataTable extends Vue {
  private _title!: string;
  private _icon!: string;
  private _price!: string;
  private _percentage!: string;

  public created() {
    this._title = this.$props.title;
    this._icon = this.$props.icon;
    this._price = this.$props.price;
    this._percentage = this.$props.percentage;
  }
}
</script>
