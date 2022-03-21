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
      v-if="nodeNameList && nodeNameList.length > 0"
      class="md:flex flex-wrap gap-2 md:gap-[12px] my-[32px]"
      style="color: white"
    >
      <NodeNft
        v-for="(node, i) of nodeNameList"
        :key="`${node.nodeValue}-${i}`"
        :name="node.nodeValue"
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

  public luckyBoxesList = luckyBoxes;

  private nodeNameList: any = [];
  private nodeCounter: any = [];
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

        let tmp;
        if (WalletModule.walletaddress) {
          const totalNodes = await handlerContract.getTotalCreatedNodes();
          this.nodeStation[0].price = parseInt(totalNodes._hex, 16).toString();

          tmp = await handlerContract.getTotalNodesOf(WalletModule.walletaddress);
          this.nodeStation[1].price = parseInt(tmp._hex, 16).toString();
          tmp = await polar.balanceOf(WalletModule.walletaddress);
          this.nodeStation[2].price = this.getFromattedNb(
            ethers.utils.formatEther(tmp._hex)
          );
        }

        const nodeSize = parseInt((await handlerContract.getNodeTypesSize())._hex, 16)
        const nodeNames = await handlerContract.getNodeTypesBetweenIndexes(0, nodeSize);
        this.nodeInst = nodeNames.map((nodeName: string, idx: number) => {
          return {
            nodeNameList: ` (Level ${idx + 1})`,
            nodeValue: nodeName.toString(),
          }
        });

        let tempCounter = [];

        for (let i = 0; i < this.nodeNameList.length; i++) {
          tempCounter.push(
            handlerContract.getNodeTypeOwnerNumber(
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
        console.error(err);
        (this.$root.$refs.alert as Default).AcceptMetamask();
      }
    }
  }
}
</script>
