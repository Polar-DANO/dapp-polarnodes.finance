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
      src:  "https://ipfs.io/ipfs/QmPL9nCnvhH7bxPmnBPVbqoTUbYJJBp6wKuFgZUCQ6YE85?filename=FUJI%20FIXE.jpg",
      video: "https://ipfs.io/ipfs/QmbqaNCGuqnMzzLq5pB8x75nWNeY55W7TBqfjwyt14w51M?filename=FUJI%20ANIM.mp4",
      title: "Fuji",
      cardId: 3556,
      price: 1.2
    },
    {
      src:  "https://ipfs.io/ipfs/QmY4qYu8jJQKzdNghzNsSdovVacyv9qEAeekHLPfwMCPRW?filename=MONT%20BLANC%20FIXE.jpg",
      video: "https://ipfs.io/ipfs/QmSm4mzJQmy97oqnN1jbxYXMQ2GE1TGz2dQsYucMivLyLV?filename=MONT%20BLANC%20ANIM.mp4",
      title: "Mont Blanc",
      price: 1.2
    },
    {
      src:  "https://ipfs.io/ipfs/QmPC1raEZ4acMve2XDcRbY7yVLjwrrMYTS8xJTHhavJx32?filename=KILIMANDJARO%20FIXE.jpg",
      video: "https://ipfs.io/ipfs/QmZJqJUAUcQ4PhxSCS1QFrG1PrKZRYwZLv6yhdorXi6HYU?filename=KILIMANDJARO%20ANIM.mp4",
      title: "Kilimanjaro",
      price: 1.2
    },
    {
      src:  "https://ipfs.io/ipfs/QmdwE4ZbMzKUR1CHP2cbCPitnccChqiaEEGsyuMx4kn1np?filename=USHUAIA%20RENDER0133.jpg",
      video: "https://ipfs.io/ipfs/QmdotjoP4x6CLFsSvKY96uTCGTwWmEURvxSuPMfdy4LxX4?filename=USHUAIA%20ANIM.mp4",
      title: "Ushuaia",
      price: 1.2
    },
    {
      src:  "https://ipfs.io/ipfs/QmNkSYLUNGdiGfZjoC68C5qth9PKkZFkge9m5xtBhiH27L?filename=EVEREST%20FIXE.jpg",
      video:  "https://ipfs.io/ipfs/Qmf9Gwn9oVaCfj4H5cRzxhwGiAMxHbEX5wVFAGdE7yBXoi?filename=EVEREST%20ANIM.mp4",
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



