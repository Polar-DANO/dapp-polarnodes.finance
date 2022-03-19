<template>
<div class="flex flex-col md:flex-row justify-between gap-2">
  <div class="flex flex-col md:flex-row gap-[6px] md:w-[30%]">
    <div class="border-solid border-[#00C6ED] border-[2px] rounded-[14px] px-[10px] md:w-[60%]">
      <v-select
        :items="nft"
        v-model="defaultSelected"
      ></v-select>
    </div>
    <div class="border-solid border-[#00C6ED] border-[2px] rounded-[14px] px-[10px] md:w-[40%]">
      <v-select
        :items="sort"
        v-model="defaultSort"
      ></v-select>
    </div>
  </div>
  <div class="w-[28%]"></div>
  <div class="flex justify-end items-center gap-4">
    <div class="border-solid rounded-[14px] border-[#00C6ED] border-[2px] p-[15px]">
      <span class="text-[white] text-[14px]">Floor Price:</span>
      <span class="text-[white] text-[14px]">5 AVAX </span>
    </div>
    <div class="border-solid rounded-[14px] border-[#00C6ED] border-[2px] p-[15px]">
      <span class="text-[white] text-[14px]">Volume:</span>
      <span class="text-[white] text-[14px]">100 AVAX</span>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { abi as NODER } from "~/hardhat/artifacts/contracts/NODERewardManager.sol/NODERewardManager.json";
import Defalut from "~/layouts/default.vue"

const {
  Token,
} = require("~/hardhat/scripts/address.js");

declare var window: any

@Component
export default class SortList extends Vue {
  private nft = ["MountainTier","list2","list3"];
  private defaultSelected = "MountainTier";
  private sort = ["Sort by","list1","list2"];
  private defaultSort ="Sort by"

  // private defaultSort = "Sort by";
}
</script>
<style>
  .v-text-field {
    padding-top: 0px !important;
    margin-top: 0px !important;
  }
  .v-input__slot {
    margin-bottom: 0px !important;
    margin-top: 9px !important;
  }
</style>
