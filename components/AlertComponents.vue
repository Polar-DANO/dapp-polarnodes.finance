<template>
<v-app-bar fixed app absolute elevation="0" color="transparent">
      <v-spacer></v-spacer>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="noInstallMetamask"
        dismissible
        transition="scale-transition"
      >
        You must install MetaMask wallet.
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="wrongNetwork"
        dismissible
        transition="scale-transition"
      >
        You must connect on the Avalanche Network
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertMustWLsale"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        You must buy with the Whitelist Sale
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertDontHaveNFT"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        You dont have the NFT Key in your wallet
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertMustSign"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        You must accept the transaction
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertAMount"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        The amount must be a number less than the Individual Allocation
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertExceedsBalance"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        Transfer amount exceeds balance
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertPurchase"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        You have already allocated this amount
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertNodesName"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        Name not available
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertnoLiquidity"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        Inssuficient Liquidity
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertNeedBalance"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        You need more tokens to purchase
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="green"
        :value="alertBuyOk"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        The transaction should have gone well, wait few minutes
      </v-alert>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="alertOverflow"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        You cannot allocate less than the previous amount
      </v-alert>
      <v-alert
        class="ma-5"
        type="info"
        color="red"
        :value="alertNodesBlacklist"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        Blacklisted address
      </v-alert>
      <v-alert
        class="ma-5"
        type="info"
        color="red"
        :value="alertresurrectionNode"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        This number must not exceed the number of nodes you have left to retrieve. Enter small numbers to avoid exceeding the gas limit.
      </v-alert>
      <v-alert
        class="ma-5"
        type="info"
        color="red"
        :value="alertBuyNodesChars"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        This name must be beetween 3 and 32 characters
      </v-alert>
      
      <v-alert
        class="ma-5"
        type="info"
        color="red"
        :value="alerAlreadyClaim"
        dismissible
        position="relative"
        transition="scale-transition"
      >
        Tokens already claimed
      </v-alert>
      <v-alert
        class="ma-5"
        type="info"
        color="red"
        :value="alertNoOwner"
        dismissible
        position="relative"
        transition="scale-transition"
      >
         NO NODE OWNER
      </v-alert>

      
    </v-app-bar>
</template>

<script lang="ts">

import { ethers } from "ethers";
import { Component, Prop, Vue } from 'nuxt-property-decorator'

declare var window: any

@Component
export default class AlertComponents extends Vue {
  public wrongNetwork = false
  public alertMustWLsale = false
  public alertMustSign = false
  public alertAMount = false
  public alertExceedsBalance = false
  public alertNeedBalance = false
  public alertBuyOk = false
  public alertPurchase = false
  public alertOverflow = false
  public alerAlreadyClaim = false
  public alertDontHaveNFT = false
  public alertBuyNodesChars = false
  public alertNodesBlacklist = false
  public alertNodesName = false
  public alertnoLiquidity = false
  public alertresurrectionNode = false  
  public alertNoOwner = false  

  public setWorngNetwork(s_wrong_network : boolean) {
      this.wrongNetwork = s_wrong_network
  }

  public async sleep(ms : any) : Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  public async MustWLsale() : Promise<void>  {
    this.alertMustWLsale = true;
    await this.sleep(3000);
    this.alertMustWLsale = false;
    this.$nuxt.refresh();
  }

  public async BuyNodesChars() : Promise<void>  {
    this.alertBuyNodesChars = true;
    await this.sleep(3000);
    this.alertBuyNodesChars = false;
    this.$nuxt.refresh();
  }

  public async NodesBlacklist() : Promise<void>  {
    this.alertNodesBlacklist = true;
    await this.sleep(3000);
    this.alertNodesBlacklist = false;
    this.$nuxt.refresh();
  }

  public async NodesName() : Promise<void>  {
    this.alertNodesName = true;
    await this.sleep(3000);
    this.alertNodesName = false;
    this.$nuxt.refresh();
  }

  public async resurrectionNode() : Promise<void>  {
    this.alertresurrectionNode = true;
    await this.sleep(10000);
    this.alertresurrectionNode = false;
    this.$nuxt.refresh();
  }

  public async DontHaveNFT() : Promise<void>  {
    this.alertDontHaveNFT = true;
    await this.sleep(3000);
    this.alertDontHaveNFT = false;
    this.$nuxt.refresh();
  }

  public async AlertAmount() : Promise<void>  {
    this.alertAMount = true;
    await this.sleep(3000);
    this.alertAMount = false;
    this.$nuxt.refresh();
  }

  public async MustSign() : Promise<void>  {
    this.alertMustSign = true;
    await this.sleep(3000);
    this.alertMustSign = false;
    this.$nuxt.refresh();
  }

  public async ExceedsBalance() : Promise<void>  {
    this.alertExceedsBalance = true;
    await this.sleep(3000);
    this.alertExceedsBalance = false;
    this.$nuxt.refresh();
  }

  public async NeedBalance() : Promise<void>  {
    this.alertNeedBalance = true;
    await this.sleep(6000);
    this.alertNeedBalance = false;
    this.$nuxt.refresh();
  }

  public async BuyOk() : Promise<void>  {
    await this.sleep(6000);
    this.alertBuyOk = true;
    await this.sleep(4000);
    this.alertBuyOk = false;
    this.$nuxt.refresh();
  }

  public async noLiquidity() : Promise<void> {
    this.alertnoLiquidity = true;
    await this.sleep(3000);
    this.alertnoLiquidity = false;
    this.$nuxt.refresh();
  }

  public async Purchase() : Promise<void>  {
    this.alertPurchase = true;
    await this.sleep(4000);
    this.alertPurchase = false;
    this.$nuxt.refresh();
  }

  public async Overflow() : Promise<void> {
    this.alertOverflow = true;
    await this.sleep(4000);
    this.alertOverflow = false;
    this.$nuxt.refresh();
  }
  
  public async AlreadyClaim() : Promise<void>  {
    this.alerAlreadyClaim = true;
    await this.sleep(4000);
    this.alerAlreadyClaim = false;
    this.$nuxt.refresh();
  }

  public async NoOwner() : Promise<void>  {
    this.alertNoOwner = true;
    await this.sleep(4000);
    this.alertNoOwner = false;
    this.$nuxt.refresh();
  }
}
</script>