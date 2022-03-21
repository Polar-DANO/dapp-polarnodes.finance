<template>
  <div class="flex flex-col md:mx-[197px] mx-[10%] mt-[30px] md:mt-4">
    <span class="text-[24px] text-white">Node Station 🚉️</span>
    <div class="md:flex flex-wrap gap-2 md:gap-[24px] mt-[32px]">
      <DataTable
        v-for="(item, i) in nodeStation"
        :key="i"
        :title="item.title"
        :icon="item.icon"
        :price="item.price"
        :percentage="item.percentage"
      />
    </div>
    <span class="mt-[64px] text-[24px] text-white">Create Node 🗻️</span>
    <div
      v-if="nodeNames && nodeNames.length > 0"
      class="md:flex flex-wrap gap-2 md:gap-[12px] my-[32px]"
      style="color: white"
    >
      <NodeNft
        v-for="(node, i) of nodeNames"
        :key="`${node}-${i}`"
        :name="node"
      />
    </div>
    <div
      v-else
      class="md:flex flex-wrap gap-2 md:gap-[12px] my-[32px]"
      style="color: white"
    >
      <NodeNftLoading v-for="index of 5" :key="`loading-node-${index}`" />
    </div>
    <span class="mt-[64px] text-[24px] text-white">Node Lucky Boxes 📦️</span>
    <div
      class="md:flex flex-wrap gap-2 md:gap-[24px] my-[32px]"
      style="color: white"
    >
      <NodeNftLuckyBox
        v-for="({ index, name, cost }, i) of luckyBoxesList"
        :key="`${name}-${i}`"
        :index="index"
        :name="name"
        :cost="cost"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Component, Prop, Vue } from "nuxt-property-decorator";
import AlertComponents from "~/components/AlertComponents.vue";

import axios from "axios";

import { abi as HANDLER_ABI } from "~/hardhat/artifacts/contracts/Handler.sol/Handler.json";
import { abi as POLAR_TOKEN_ABI } from "~/hardhat/artifacts/contracts/Polar.sol/Polar.json";
import Default from "~/layouts/default.vue";
import { WalletModule } from "~/store";
import { NodeNftNames } from "~/models/types";
import { luckyBoxes } from "~/models/constants";

const { Token: PolarToken, Handler } = require("~/hardhat/scripts/address.js");

declare var window: any;

@Component({
  components: { AlertComponents },
})
export default class Nodes extends Vue {
  public nodeStation = [
    {
      icon: require("../assets/img/nodesIcon/totalnodes_icon.svg"),
      title: "Total Nodes",
      price: "0",
      percentage: "0",
    },
    {
      icon: require("../assets/img/nodesIcon/mynodes_icon.svg"),
      title: "My Nodes",
      price: "0",
      percentage: "0",
    },
    {
      icon: require("../assets/img/nodesIcon/polarbalance_icon.svg"),
      title: "My $POLAR Balance",
      price: "0",
      percentage: "0",
    },
  ];

  public luckyBoxesList = luckyBoxes;

  private nodeNames: any = [];

  private async created(): Promise<void> {
    this.listenConnectEvent();
    this.intervalFetchData();
  }

  public intervalFetchData(): void {
    setInterval(() => {
      this.listenConnectEvent();
    }, 15000);
  }
  private async listenConnectEvent(): Promise<void> {
    if (window.ethereum) {
      const ethers = require("ethers");

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      try {
        const signer = provider.getSigner();

        const handlerContract = new ethers.Contract(Handler, HANDLER_ABI, signer);
        const polar = new ethers.Contract(PolarToken, POLAR_TOKEN_ABI, signer);

        const totalNodes = await handlerContract.getTotalCreatedNodes();
        this.nodeStation[0].price = totalNodes.toString();
        this.nodeStation[1].price = (WalletModule.walletaddress)
          ? (await handlerContract.getTotalNodesOf(WalletModule.walletaddress)).toString()
          : "-";
        this.nodeStation[2].price = (WalletModule.walletaddress)
          ? (await polar.balanceOf(WalletModule.walletaddress)).toString()
          : "-";


        const nodeSize = (await handlerContract.getNodeTypesSize()).toNumber();
        this.nodeNames = await handlerContract.getNodeTypesBetweenIndexes(0, nodeSize);
      } catch (err) {
        console.error(err);
        (this.$root.$refs.alert as Default).AcceptMetamask();
      }
    }
  }
}
</script>
