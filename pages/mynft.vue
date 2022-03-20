<template>
  <div class="flex flex-col md:mx-[164px] mx-[10%] mt-[30px] md:mt-[84px]">
  
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
export default class Mynft extends Vue {
}
</script>