<template>
  <div class="flex flex-col md:mx-[164px] mx-[10%] mt-[30px] md:mt-[84px]">
    <span class="text-[24px] text-[#FFFFFF] ml-[3px] mb-[32px]">Polar NFT Market 🛒</span>
    <SortList/>
    <div class="grid md:grid-cols-3 gap-4 mt-[30px]">
      <Card v-for="(list, i) in artList" 
        :key="i"
        :card="list"
        @cardModal="clickedCardModal" />
    </div> 
    <div v-if="showModal">
        <CardDetailModal :dataDetail="selectedData" @closeModal="()=>showModal=false"/>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import axios from "axios"

import { abi as NODER } from "~/hardhat/artifacts/contracts/NODERewardManager.sol/NODERewardManager.json";
import { abi as POLAR } from "~/hardhat/artifacts/contracts/PolarNodes.sol/PolarNodes.json";
import {WalletModule} from '~/store'


const {
  Token,
  PolarToken
} = require("~/hardhat/scripts/address.js");

declare var window: any

@Component
export default class Market extends Vue {

  private artList = [
    {
      src:  require("../assets/PACK/FUJI-FIXE.jpg"),
      video: require("../assets/PACK/FUJI ANIM.mp4"),
      title: "Fuji",
      cardId: 3556,
      price: 1.2
    },
    {
      src:  require("../assets/PACK/MONT BLANC FIXE.jpg"),
      video: require("../assets/PACK/MONT BLANC ANIM.mp4"),
      title: "Mont Blanc",
      price: 1.2
    },
    {
      src:  require("../assets/PACK/KILIMANDJARO FIXE.jpg"),
      video: require("../assets/PACK/KILIMANDJARO ANIM.mp4"),
      title: "Kilimanjaro",
      price: 1.2
    },
    {
      src:  require("../assets/PACK/USHUAIA RENDER0133.jpg"),
      video: require("../assets/PACK/USHUAIA ANIM.mp4"),
      title: "Ushuaia",
      price: 1.2
    },
    {
      src:  require("../assets/PACK/EVEREST FIXE.jpg"),
      video:  require("../assets/PACK/EVEREST ANIM.mp4"),
      title: "Everest",
      price: 1.2
    }
  ]

  private showModal = false
  private selectedData = []
  public image: string | null = null;
  private clickedCardModal(val:any) {
    this.showModal = true
    this.selectedData = val
  }

   public created() { 
     this.showModal = false
   }
}
</script>



