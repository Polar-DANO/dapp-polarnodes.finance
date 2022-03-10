<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[123px]"
  >
    <div class="node-card__header">
      Create {{ nodeNftName }} Mountain NFT 🗻️
    </div>
    <div class="mt-8 mb-16 mx-16">
      <div class="node-card__subtitle">
        Create a Mountain NFT with $POLAR tokens to earn lifetime high-yield
        token rewards!
      </div>
      <VRow justify="space-between" class="mt-8">
        <VCol cols="12" md="6" class="d-flex align-center">
          <img
            src="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg"
            class="node-image"
          />
        </VCol>
        <VCol cols="12" md="6">
          <div class="text-center">
            <div class="node-card__outlined pa-5">
              Earn {{ dailyEarning }} $POLAR per day
            </div>
            <div class="node-card__content inline-block my-5">
              <VRow
                v-for="db in dataBlocks"
                :key="db.key"
                justify="center"
                class="my-1 ml-0 node-card__data-block"
              >
                <VCol
                  md="auto"
                  class="py-2 px-6 node-card__data-block__blue d-flex align-center"
                >
                  {{ db.key }}
                </VCol>
                <VCol
                  class="pa-1 text-center d-flex align-center justify-center"
                >
                  {{ db.value }} {{ db.unit }}
                </VCol>
              </VRow>

              <div class="mt-6 mb-1 d-flex justify-center items-center">
                <VBtn small rounded color="#00c6ed" dark @click="onRemove">
                  -
                </VBtn>
                <div class="mx-auto">
                  <VTextField
                    v-model.number="quantity"
                    dark
                    class="centered-input"
                  />
                </div>
                <VBtn small rounded color="#00c6ed" dark @click="onAdd">
                  +
                </VBtn>
              </div>
            </div>
            <VBtn
              class="node-card__outlined node-card__button pa-2"
              dark
              text
              :disabled="quantity < 1"
            >
              Create
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { NodeNftNames } from "~/models/types";
import { abi as NODER } from "~/hardhat/artifacts/contracts/NODERewardManager.sol/NODERewardManager.json";

const ethers = require("ethers");
const { Token, PolarToken, Owner } = require("~/hardhat/scripts/address.js");
const URL_TO_NAME = {
  fuji: NodeNftNames.Fuji,
  "mont-blanc": NodeNftNames.MontBlanc,
  kilimanjaro: NodeNftNames.Kilimanjaro,
  ushuaia: NodeNftNames.Ushuaia,
  everest: NodeNftNames.Everest,
};

type Url = "fuji" | "mont-blanc" | "kilimanjaro" | "ushuaia" | "everest";

@Component({})
export default class Create extends Vue {
  public nodeNftName: NodeNftNames | null = null;
  public quantity = 1;

  private dailyEarningPerNode = 0;
  private cost = 0;
  private roi = 1.5;
  private tax = 1;

  private async created() {
    const nodeNftName = URL_TO_NAME[this.$route.params.id as Url];

    if (nodeNftName) {
      this.nodeNftName = nodeNftName;
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const pnode = new ethers.Contract(Token, NODER, signer);
        const nodeData = await pnode.getNodeTypeAll(nodeNftName);

        this.cost = ethers.utils.formatEther(nodeData[0]._hex);
        this.dailyEarningPerNode = ethers.utils.formatEther(nodeData[2]._hex);
      } catch (err) {
        console.log(err);
      }
    } else {
      this.$router.push("/nodes");
    }
  }

  public onRemove() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  public onAdd() {
    this.quantity++;
  }

  get dataBlocks() {
    const { cost, roi, tax } = this;
    return [
      { key: "Cost:", value: cost, unit: "$POLAR" },
      { key: "ROI / day:", value: roi, unit: "%" },
      { key: "Claim Tax:", value: tax, unit: "%" },
    ];
  }

  get dailyEarning() {
    const { quantity, dailyEarningPerNode } = this;

    return (dailyEarningPerNode * quantity).toFixed(2);
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}

.node-image {
  width: 100%;
  min-width: 150px;
  border-radius: 14px;
  height: 100%;
  object-fit: cover;
}

.node-card {
  width: 90%;
  max-width: 980px;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  background-color: #17171b;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
}

.node-card__header {
  min-height: 60px;
  border-radius: 10px 10px 0px 0px;
  padding: 16px;
  background-color: #00c6ed;
  font-family: WorkSans;
  font-size: 24px;
  font-weight: 600;
}

.node-card__subtitle {
  font-family: WorkSans;
  font-size: 16px;
  font-weight: 500;
}

.node-card__button {
  text-transform: none !important;
}
.node-card__outlined {
  min-width: 250px !important;
  width: 100%;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  font-size: 16px;
  font-weight: 600;
  background-color: rgba(0, 198, 237, 0);
}

.node-card__content {
  width: 200px;
}

.node-card__data-block {
  width: 100%;
  font-size: 14px;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  background-color: rgba(0, 198, 237, 0);
}

.node-card__data-block__blue {
  background-color: #00c6ed;
  font-size: 14px;
  border-radius: 10px 0px 0px 10px;
}
</style>
