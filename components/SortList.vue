<template>
<div class="md:flex flex-col md:flex-wrap bg-[#17171B] rounded-[12px] min-h-[172px] border-solid border-[#00C6ED] border-[1px]  py-[16px] px-[16px] gap-2">
  <div class="grid md:grid-cols-4 gap-4 mt-[10px]">
    <v-select
      :items="pricesort"

    ></v-select>
    <v-select
      :items="pricesort"

    ></v-select>
    <v-select
      :items="pricesort"

    ></v-select>
    <v-select
      :items="pricesort"

    ></v-select>
    <v-select
      :items="pricesort"

    ></v-select>
   <v-select
      :items="pricesort"

    ></v-select>
  </div>
  <div class="flex  flex-wrap items-center gap-4">
    <div class="flex justify-center">
      <img class="w-[22px] h-[22px] mr-[5px]" :src="require('../assets/img/logo.svg')" alt="">
      <span class="text-[white]">Floor:</span>
      <span class="text-[white]">0.6 AVAX </span>
    </div>
    <div class="flex">
      <img class="w-[22px] h-[22px] mr-[5px]"  :src="require('../assets/img/logo.svg')" alt="">
      <span class="text-[white]">VOLUME:</span>
      <span class="text-[white]">478.34 AVAX</span>
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
  public pricesort = ["list1","list2","list3"]
}
</script>
