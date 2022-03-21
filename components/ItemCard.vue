<template>
  <div
    class="md:flex flex-col md:flex-wrap bg-[#17171B] border-solid border-[#00C6ED] border-[1px] rounded-[14px] p-[15px] nftCard"
    @click="$emit('click')"
  >
    <div class="border-solid border-[#00C6ED] border-[2px] rounded-[14px]">
      <img
        class="mr-[5px] rounded-[14px] height-[140px]"
        :src="data.src"
        alt=""
      />
    </div>
    <div class="text-[white] text-[16px] mt-[16px]">{{ data.title }}#123</div>
    <div class="flex justify-between mt-[16px]">
      <div class="flex flex-col">
        <span class="text-[#00C6ED] text-[12px]"> Buy Now </span>
        <span class="text-[white] text-[16px]">100.89 POLAR </span>
      </div>
      <div class="flex flex-col">
        <span class="text-[#00C6ED] text-[12px]">Current Bid</span>
        <span class="text-[white] text-[16px]">100.89 POLAR </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  props: {
    data: Object,
  },
})
export default class SortList extends Vue {}
</script>

<style scoped>
.nftCard:hover {
  box-shadow: 0 0 14px 14px rgba(0, 198, 237, 0.5);
}
.nftCard {
  cursor: pointer;
}
</style>
