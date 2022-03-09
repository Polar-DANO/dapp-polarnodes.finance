<template>
  <div class="node-nft" @click="onSelectNode">
    <div class="node-nft__title">{{ name }}</div>
    <div class="node-nft__blue-text my-1">
      Earn {{ dailyEarnings }} $POLAR / day
    </div>
    <div class="divider mt-2" />

    <div class="spacer" />

    <div class="divider" />

    <div class="inline-block text-left">
      <div class="mt-2">
        <span class="node-nft__blue-text">Cost: </span>
        {{ cost }} $POLAR
      </div>
      <div class="mt-1">
        <span class="node-nft__blue-text">Claim tax: </span>
        {{ claimTax }}%
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { abi as NODER } from "~/hardhat/artifacts/contracts/NODERewardManager.sol/NODERewardManager.json";
import { NodeNftNames } from "~/models/types";

const ethers = require("ethers");
const { Token, PolarToken, Owner } = require("~/hardhat/scripts/address.js");

const NAME_TO_URL = {
  [NodeNftNames.Fuji]: "fuji",
  [NodeNftNames.MontBlanc]: "mont-blanc",
  [NodeNftNames.Kilimanjaro]: "kilimanjaro",
  [NodeNftNames.Ushuaia]: "ushuaia",
  [NodeNftNames.Everest]: "everest",
};

@Component({
  props: {
    name: { type: String },
  },
})
export default class NodeNft extends Vue {
  public dailyEarnings = null;
  public cost = null;
  public claimTax = 1;

  public onSelectNode() {
    this.$router.push(`/create/${NAME_TO_URL[this.$props.name]}`);
  }

  private async created() {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const pnode = new ethers.Contract(Token, NODER, signer);
      const nodeData = await pnode.getNodeTypeAll(this.$props.name);

      this.cost = ethers.utils.formatEther(nodeData[0]._hex);
      this.dailyEarnings = parseFloat(
        ethers.utils.formatEther(nodeData[2]._hex)
      ).toFixed(3);
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style scoped>
.spacer {
  height: 127px;
}

.divider {
  height: 1px;
  flex-grow: 0;
  background-color: rgba(255, 255, 255, 0.1);
}

.node-nft:hover {
  box-shadow: 0 0 14px 14px rgba(0, 198, 237, 0.5);
}

.node-nft {
  min-width: 180px;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  height: 242px;
  flex-grow: 1;
  padding: 12px 0;
  border-radius: 14px;
  border: solid 1px #00c6ed;
  background-color: #17171b;
  font-family: WorkSans;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fff;
}

.node-nft__title {
  font-size: 16px;
}

.node-nft__blue-text {
  color: #00c6ed;
}
</style>
