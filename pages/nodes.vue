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
      class="md:flex flex-wrap gap-2 md:gap-[24px] my-[32px]"
      style="color: white"
    >
      <NodeNft
        v-for="(node, i) of nodeNameList"
        :key="`${node.nodeValue}-${i}`"
        :name="node.nodeValue"
      />
    </div>
    <div class="my-[32px]">
      <NodeTable :items="myNodeData" />
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
import { NodeNftNames } from "~/models/types";

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

  private nodeNameList: any = [];
  private nodeCounter: any = [];
  private myNodeData: any = [];
  private counterTemp: any = [];
  private myNodeList: any = [];
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

          const totalNodes = await pnode.getTotalCreatedNodes();
          this.nodeStation[0].price = parseInt(totalNodes._hex, 16).toString();

          tmp = await pnode.getTotalCreatedNodesOf(WalletModule.walletaddress);
          this.nodeStation[1].price = parseInt(tmp._hex, 16).toString();
          tmp = await polar.balanceOf(WalletModule.walletaddress);
          this.nodeStation[2].price = this.getFromattedNb(
            ethers.utils.formatEther(tmp._hex)
          );
        }
        tmp = await pnode.getNodeTypesSize();
        let nodeSize = parseInt(tmp._hex, 16);

        let tempNodeNameList = [];
        for (let i = 0; i < nodeSize; i++) {
          tempNodeNameList.push(pnode.getNodeTypeNameAtIndex(i));
        }
        await Promise.all(tempNodeNameList).then(res => {
          this.nodeNameList = [];
          for (let i = 0; i < res.length; i++) {
            this.nodeInst = {
              nodeNameList: res[i] + " (Level " + (i + 1) + ")",
              nodeValue: res[i].toString(),
            };
            this.nodeNameList.push(this.nodeInst);
          }
        });

        let tempCounter = [];

        for (let i = 0; i < this.nodeNameList.length; i++) {
          tempCounter.push(
            pnode.getNodeTypeOwnerNumber(
              this.nodeNameList[i].nodeValue,
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
        for (let i = 0; i < this.nodeNameList.length; i++) {
          if (this.nodeCounter[i] != 0) {
            this.counterTemp = {
              nodeIndex: i + 1,
              nodeType: this.nodeNameList[i].nodeValue,
              nodeCounter: this.nodeCounter[i],
            };
            this.myNodeData.push(this.counterTemp);
            for (let j = 0; j < this.nodeCounter[i]; j++) {
              let temp = {
                nodeNameList: this.nodeNameList[i].nodeValue,
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
