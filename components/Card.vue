<template>
<div class="md:flex flex-col md:flex-wrap bg-[#17171B] rounded-[16px] p-[15px]">
   <img class="mr-[5px] rounded-t-[20px] rounded-b-[12px]" :src="cardData.src" alt="" @click="$emit('cardModal',cardData)"/>
   <div class="flex flex-wrap mt-[10px] items-center px-[30px]" @click="$emit(cardModal)">
    <div class="w-[41px] h-[41px] rounded-[50%] border-solid border-[#00C6ED] border-[2px] text-[#00C6ED] text-center font-bold p-[6px]">{{cardData.level}}</div>
    <span class="text-[16px] font-bold ml-[15px] text-[#00C6ED]">POLAR</span>
    <span class="text-[16px] font-bold ml-[5px] text-[#00C6ED]">{{cardData.cardId}}</span>
   </div>
   <div class="flex flex-wrap items-center mt-[10px] px-[30px]">
    <img class="w-[22px] h-[22px] mx-[14px]" :src="require('../assets/img/logo.svg')" alt=""/>
    <span class="text-[16px] ml-[5px] text-[#00C6ED]">{{cardData.price}}</span>
    <span class="text-[16px] ml-[5px] text-[#00C6ED]">POLAR</span>
   </div>
   <!-- <CardDetailModal v-show="showModal"/> -->
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

@Component({
  props:{
    card:Array
  }
})
export default class SortList extends Vue {
  public pricesort = ["list1","list2","list3"]
  
  private cardData = []

  private created() {
    this.cardData = this.$props.card;
  }
}
</script>
