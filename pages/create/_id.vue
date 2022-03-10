<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[123px]"
  >
    <div class="node-card__header">Create {{ nodeNftName }} Mountain 🗻️</div>
    <div class="mt-8 mb-16 mx-16">
      <div class="node-card__subtitle">
        Create a Mountain with $POLAR tokens to earn lifetime high-yield token
        rewards!
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
              v-if="isApprove"
              class="node-card__outlined node-card__button pa-2"
              dark
              text
              @click="onApprove"
            >
              Approve
            </VBtn>
            <VBtn
              v-else
              class="node-card__outlined node-card__button pa-2"
              dark
              text
              :disabled="quantity < 1"
              @click="onCreate"
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
import { abi as POLAR } from "~/hardhat/artifacts/contracts/PolarNodes.sol/PolarNodes.json";
import { WalletModule } from "~/store";

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
  public isApprove = true;

  private dailyEarningPerNode = 0;
  private cost = 0;
  private tax: number | null = null;
  private polar: any;
  private pnode: any;

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
        this.polar = new ethers.Contract(PolarToken, POLAR, signer);
        this.isApprove =
          (await this.polar.allowance(WalletModule.walletaddress, Token)) == 0;
        this.pnode = new ethers.Contract(Token, NODER, signer);

        const nodeData = await this.pnode.getNodeTypeAll(nodeNftName);

        this.cost = ethers.utils.formatEther(nodeData[0]._hex);
        this.dailyEarningPerNode =
          ethers.utils.formatEther(nodeData[2]._hex) * 6;
        this.tax = parseInt(nodeData[6]._hex, 16) + 1;
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

  public onError(err: any) {
    if (err) {
      if (err.message.indexOf("User denied transaction signature") >= 0) {
        (this.$root.$refs.alert as any).MustSign();
        return;
      } else if (err.message.indexOf("Global limit reached") >= 0) {
        (this.$root.$refs.alert as any).MaxReached();
        return;
      } else if (
        err.message.indexOf("Creation with pending limit reached for user") >= 0
      ) {
        (this.$root.$refs.alert as any).UserMaxReached();
        return;
      } else if (err.message.indexOf("Balance too low for creation") >= 0) {
        (this.$root.$refs.alert as any).NeedBalance();
        return;
      } else if (err.message.indexOf("nodeTypeName does not exist") >= 0) {
        (this.$root.$refs.alert as any).NodesName();
        return;
      } else if (err.message.indexOf("Blacklisted address") >= 0) {
        (this.$root.$refs.alert as any).NodesBlacklist();
        return;
      } else if (err.message.indexOf("fInsufficient Pending") >= 0) {
        (this.$root.$refs.alert as any).noLiquidity();
        return;
      } else if (err.message.indexOf("Balance too low for creation.") >= 0) {
        (this.$root.$refs.alert as any).NeedBalance();
        return;
      } else if (err.message.indexOf("Node creation not authorized yet") >= 0) {
        (this.$root.$refs.alert as any).NotAuthorized();
        return;
      } else if (
        err.message.indexOf("futur and rewardsPool cannot create node") >= 0
      ) {
        (this.$root.$refs.alert as any).NotFutur();
        return;
      } else if (err.message.indexOf("Max already reached") >= 0) {
        (this.$root.$refs.alert as any).MaxReached();
        return;
      } else {
        (this.$root.$refs.alert as any).OtherError();
        return;
      }
    } else {
      if (
        err.message.indexOf(
          "MetaMask Tx Signature: User denied transaction signature."
        ) >= 0
      ) {
        (this.$root.$refs.alert as any).UserReject();
        return;
      }
    }

    return;
  }

  public async onApprove() {
    try {
      await this.polar.approve(
        Token,
        ethers.BigNumber.from(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        )
      );
      this.isApprove = false;
    } catch (err: any) {
      this.onError(err);
    }
  }

  public async onCreate() {
    try {
      await this.pnode.createNodeWithTokens(this.nodeNftName, this.quantity);
    } catch (err: any) {
      this.onError(err);
    }
  }

  get dataBlocks() {
    const { cost, roi, tax, quantity } = this;
    return [
      { key: "Cost:", value: cost * quantity, unit: "$POLAR" },
      { key: "ROI / day:", value: roi, unit: "%" },
      { key: "Claim Tax:", value: tax, unit: "%" },
    ];
  }

  get dailyEarning() {
    const { quantity, dailyEarningPerNode } = this;
    return (dailyEarningPerNode * quantity).toFixed(2);
  }

  get roi() {
    const { dailyEarningPerNode, cost } = this;
    return ((dailyEarningPerNode / cost) * 100).toFixed(2);
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
