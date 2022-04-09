<template>
  <v-dialog
    v-model="dialog"
    width="600"
  >
    <template #activator="{ on, attrs }">
      <div class="flex flex-col align-center md:flex md:flex-row justify-end md:mt-[24px] md:mr-[24px] gap-[16px]">
        <div class="mt-0">
          <!-- <v-btn
              x-large
              elevation="0"
              v-bind="attrs"
              @click = "buyPolar"
              class="bg-[#00C6ED] rounded-[14px] w-[188px] md:w-[204px] h-[40px]"
            > -->
          <a v-if="!isTestnet" href="https://traderjoexyz.com/trade?outputCurrency=0x6c1c0319d8ddcb0ffe1a68c5b3829fd361587db4#/" target="_blank">
            <div class="flex flex-row justify-center mx-[24px] normal-case bg-[#00C6ED] rounded-[14px] w-[188px] md:w-[204px] h-[40px]">
              <img class="mr-[10px] p-[6px]" :src="require('../assets/img/buypolar.svg')" alt="">
              <span class="text-[14px] text-[#FFFFFF]  py-[12px] font-semibold">Buy $POLAR</span>
            </div>
          </a>
          <v-btn
            v-else-if="canMintPolar"
            :loading="isBtnLoading"
            dark
            x-large
            elevation="0"
            class="bg-[#00C6ED] rounded-[14px]  w-[188px] md:w-[204px] h-[40px]"
            @click="mintPolar"
          >
            <div class="flex flex-row justify-center mx-[34px] normal-case">
              <img class="mr-[10px]" :src="require('../assets/img/wallet.svg')" alt="">
              <span class="text-[14px] text-white py-[12px] font-semibold">Mint $POLAR</span>
            </div>
          </v-btn>

          <!-- </v-btn> -->
        </div>
        <div v-if="!isLoggedIn" class="mt-0">
          <v-btn
            x-large
            elevation="0"
            v-bind="attrs"
            class="bg-[#00C6ED] rounded-[14px]  w-[188px] md:w-[204px] h-[40px]"
            v-on="on"
          >
            <div class="flex flex-row justify-center mx-[34px] normal-case">
              <img class="mr-[10px]" :src="require('../assets/img/wallet.svg')" alt="">
              <span class="text-[14px] text-white py-[12px] font-semibold">{{ $t("connexion") }}</span>
            </div>
          </v-btn>
        </div>
        <div v-if="isLoggedIn" class="mt-0">
          <v-btn
            x-large
            elevation="0"
            v-bind="attrs"
            class="bg-[#00C6ED] rounded-[14px]  w-[188px] md:w-[204px] h-[40px]"
            @click="logout"
          >
            <div class="flex flex-row justify-center mx-[34px] normal-case">
              <img class="mr-[10px]" :src="require('../assets/img/wallet.svg')" alt="">
              <span class="text-[14px] text-white py-[12px] font-semibold cursor-pointer">{{ walletAddress.slice(0, 5) + '...'+ walletAddress.slice(-4, walletAddress.length) }}</span>
            </div>
          </v-btn>
        </div>
      </div>
    </template>

    <v-card class="bg-[#17171B] rounded-[16px]">
      <v-btn class="absolute right-2" icon @click="dialog = false">
        <v-icon class="text-white">
          mdi-close
        </v-icon>
      </v-btn>
      <div class="text-center text-white rounded-[50px] px-[10px] py-[20px]">
        <v-card-text>
          <div class="text-h4 text-[#b1ebfc] font-bold">
            {{ $t("connect-wallet") }}
          </div>
          <div class="p-[3px]">
            {{ $t("connect1") }}<br>
            {{ $t("connect2") }}
          </div>
        </v-card-text>
        <v-btn
          x-large
          class="bg-[#00C6ED] relative justify-start mb-[10px] text-[20px] rounded-[12px] md:w-7/12 w-[280px] normal-case"
          @click="requestMetamask"
        >
          <img class="w-[32px] h-[32px] mr-[10px]" src="~/assets/img/metamask-logo.svg"><span class="text-white">
            MetaMask</span><img
            class="absolute right-[-15px]"
            src="~/assets/img/fleche-wallet.svg"
          >
        </v-btn>

        <v-btn
          x-large
          class="bg-[#00C6ED] relative justify-start mb-[10px] text-[20px] rounded-[12px] md:w-7/12 w-[280px] normal-case"
          @click="requestWalletConnect"
        >
          <img class="w-[32px] h-[32px] mr-[10px]" src="~/assets/img/walletconnect.svg"><span class="text-white">
            Wallet Connect</span><img
            class="absolute right-[-15px]"
            src="~/assets/img/fleche-wallet.svg"
          >
        </v-btn>
      </div>
      <v-divider />
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import WalletReactiveFetch from '~/mixins/wallet-reactive-fetch';

@Component
export default class ConnectionBtn extends WalletReactiveFetch {
  private isTestnet = false;
  private isBtnLoading = false;

  created () {
    this.isTestnet = !!process.env.isTestnet;
  }

  get canMintPolar () {
    return !this.$store.state.tokens.gotToken;
  }

  get walletAddress () {
    return this.$store.getters['wallet/address'];
  }

  get isLoggedIn () {
    return this.$store.getters['wallet/hasAddress'];
  }

  private dialog = false;

  logout () {
    if (this.$store.getters['wallet/isConnected']) {
      this.$store.dispatch('wallet/logout');
    }
  }

  async requestMetamask () {
    try {
      await this.$store.dispatch('wallet/requestMetamask');
    } finally {
      this.dialog = false;
    }
  }

  async requestWalletConnect () {
    try {
      await this.$store.dispatch('wallet/requestWalletConnect');
    } finally {
      this.dialog = false;
    }
  }

  async mintPolar () {
    try {
      this.isBtnLoading = true;
      await this.$store.dispatch('tokens/getPolarToken');
    } finally {
      this.isBtnLoading = false;
    }
  }

  async reactiveFetch () {
    if (this.isLoggedIn) {
      await this.$store.dispatch('tokens/fetchGotToken');
    }
  }
}
</script>
