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
    <div class="md:flex flex-wrap gap-2 md:gap-[28px] mt-[32px]">
      <NodeNft
        v-for="(node, i) of nodeNfts"
        :key="`${name}-${i}`"
        :name="node.name"
        :daily-earnings="node.dailyEarnings"
        :cost="node.cost"
        :claim-tax="node.claimTax"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Component, Prop, Vue } from "nuxt-property-decorator";
import AlertComponents from "~/components/AlertComponents.vue";

import axios from "axios";

import { abi as NODER } from "~/hardhat/artifacts/contracts/NODERewardManager.sol/NODERewardManager.json";
import { abi as POLAR } from "~/hardhat/artifacts/contracts/PolarNodes.sol/PolarNodes.json";
import Defalut from "~/layouts/default.vue";

import { WalletModule } from "~/store";

const { Token, PolarToken } = require("~/hardhat/scripts/address.js");

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

  public nodeNfts = [
    { name: "Fuji", dailyEarnings: 0.45, cost: 30, claimTax: 1 },
    { name: "Mont Blanc", dailyEarnings: 0.99, cost: 55, claimTax: 3 },
    { name: "Killimanjaro", dailyEarnings: 5, cost: 250, claimTax: 5 },
    { name: "Ushuaia", dailyEarnings: 9.2, cost: 400, claimTax: 8 },
    { name: "Everest", dailyEarnings: 35, cost: 1000, claimTax: 10 },
  ];

  private nodeData = [
    {
      nodeType: "test1",
      nodeCounter: 3,
    },
    {
      nodeType: "test2",
      nodeCounter: 4,
    },
    {
      nodeType: "test3",
      nodeCounter: 5,
    },
  ];

  private nodeName: any = [];
  private nodeCounter: any = [];
  private myNodeData: any = [];
  private counterTemp: any = [];
  private myNodeList: any = [];
  private nodeNameList: any = [];
  private nodeInst: any;

  private getFromattedNb(nb: any): string {
    nb = nb.toLocaleString();
    if (nb.indexOf(".") == -1) return nb;
    else {
      if (nb.indexOf(".") == nb.length - 2)
        return nb.substr(0, nb.indexOf(".") + 2) + "0";
    }
    return nb.substr(0, nb.indexOf(".") + 3);
  }
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
    this.myNodeData = [];

    if (window.ethereum) {
      const ethers = require("ethers");

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      try {
        const signer = provider.getSigner();

        const pnode = new ethers.Contract(Token, NODER, signer);
        const polar = new ethers.Contract(PolarToken, POLAR, signer);

        let tmp;
        if (WalletModule.walletaddress) {
          tmp = await pnode.calculateAllClaimableRewards(
            WalletModule.walletaddress
          );
          this.nodeStation[0].price = this.getFromattedNb(
            ethers.utils.formatEther(tmp._hex)
          );

          tmp = await pnode.getTotalCreatedNodesOf(WalletModule.walletaddress);
          this.nodeStation[1].price = parseInt(tmp._hex, 16).toString();
          tmp = await polar.balanceOf(WalletModule.walletaddress);
          this.nodeStation[2].price = this.getFromattedNb(
            ethers.utils.formatEther(tmp._hex)
          );
        }
        tmp = await pnode.getNodeTypesSize();
        let nodeSize = parseInt(tmp._hex, 16);

        let tempNodeName = [];
        for (let i = 0; i < nodeSize; i++) {
          tempNodeName.push(pnode.getNodeTypeNameAtIndex(i));
        }
        await Promise.all(tempNodeName).then(res => {
          this.nodeName = [];
          for (let i = 0; i < res.length; i++) {
            this.nodeInst = {
              nodeName: res[i] + " (Level " + (i + 1) + ")",
              nodeValue: res[i].toString(),
            };
            this.nodeName.push(this.nodeInst);
          }
        });

        let tempCounter = [];

        for (let i = 0; i < this.nodeName.length; i++) {
          tempCounter.push(
            pnode.getNodeTypeOwnerNumber(
              this.nodeName[i].nodeValue,
              WalletModule.walletaddress
            )
          );
        }

        await Promise.all(tempCounter).then((res: any) => {
          for (let index in res)
            this.nodeCounter[index] = parseInt(res[index]._hex, 16);
        });

        this.myNodeList = [];
        let index = 0;
        for (let i = 0; i < this.nodeName.length; i++) {
          if (this.nodeCounter[i] != 0) {
            this.counterTemp = {
              nodeIndex: i + 1,
              nodeType: this.nodeName[i].nodeValue,
              nodeCounter: this.nodeCounter[i],
            };
            this.myNodeData.push(this.counterTemp);
            for (let j = 0; j < this.nodeCounter[i]; j++) {
              let temp = {
                nodeName: this.nodeName[i].nodeValue,
                index: index++,
              };
              this.myNodeList.push(temp);
            }
          }
        }
      } catch (err) {
        (this.$root.$refs.alert as Defalut).AcceptMetamask();
      }
    }
  }
}
</script>
