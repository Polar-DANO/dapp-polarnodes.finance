<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[100px]"
  >
    <div class="node-card__header">Buy {{ name }} 📦</div>
    <div class="mt-8 mb-16 mx-16">
      <div class="node-card__subtitle">
        Buy a Lucky Box with $POLAR tokens for your chance to win a random
        Mountain NFT!
      </div>
      <VRow justify="space-between" class="mt-8">
        <VCol cols="12" md="6" class="d-flex align-center">
          <video class="node-video" autoplay loop muted>
            <source
              :src="require('../../assets/PACK/LUCKY_BOX_NEUTRAL_ANIM.mp4')"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </VCol>
        <VCol cols="12" md="6">
          <div class="text-center">
            <div class="node-card__odds">Odds:</div>
            <div class="node-card__odds__outlined py-4 inline-block mt-2">
              <VRow
                v-for="chance in chances"
                :key="chance.key"
                justify="center"
                no-gutters
              >
                <VCol class="text-right"> {{ chance.key }}: </VCol>
                <VDivider vertical dark class="mx-4" />
                <VCol class="text-left"> {{ chance.value }}% Chance </VCol>
              </VRow>
            </div>

            <div class="node-card__content inline-block mt-2">
              <VRow
                v-for="db in dataBlocks"
                :key="db.key"
                justify="center"
                class="mt-4 ml-0 node-card__data-block"
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

              <div class="mt-4 d-flex justify-center items-center">
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
              @click="onBuy"
            >
              Buy
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { abi as NODER } from "~/hardhat/artifacts/contracts/Handler.sol/Handler.json";
import { abi as POLAR } from "~/hardhat/artifacts/contracts/PolarNode.sol/PolarNode.json";
import { WalletModule } from "~/store";
import { LUCKY_BOX_BY_INDEX, LuckyBoxId } from "~/models/constants";

const ethers = require("ethers");
const { Token, PolarToken, Owner } = require("~/hardhat/scripts/address.js");

@Component({})
export default class Create extends Vue {
  public name: string | null = null;
  public quantity = 1;
  private cost = 0;
  public chances = [
    { key: "Fuji", value: 20 },
    { key: "Mont Blanc", value: 20 },
    { key: "Killimanjaro", value: 20 },
    { key: "Ushuaia", value: 20 },
    { key: "Everest", value: 20 },
  ];

  public isApprove = true;

  private dailyEarningPerNode = 0;
  private tax: number | null = null;
  private polar: any;
  private pnode: any;

  private async created() {
    const luckyBoxIndex = this.$route.params.id as LuckyBoxId;

    if (LUCKY_BOX_BY_INDEX[luckyBoxIndex]) {
      const { name, cost } = LUCKY_BOX_BY_INDEX[luckyBoxIndex];

      this.name = name;
      this.cost = cost;
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

  public onError(err: { message: string } | null): void {
    if (err) {
      const inAppAlert = this.$root.$refs.alert as unknown as Record<
        string,
        Function
      >;

      if (err.message.includes("User denied transaction signature")) {
        inAppAlert.MustSign();
      } else if (err.message.includes("Global limit reached")) {
        inAppAlert.MaxReached();
      } else if (
        err.message.includes("Creation with pending limit reached for user")
      ) {
        inAppAlert.UserMaxReached();
      } else if (err.message.includes("Balance too low for creation")) {
        inAppAlert.NeedBalance();
      } else if (err.message.includes("nodeTypeName does not exist")) {
        inAppAlert.NodesName();
      } else if (err.message.includes("Blacklisted address")) {
        inAppAlert.NodesBlacklist();
      } else if (err.message.includes("fInsufficient Pending")) {
        inAppAlert.noLiquidity();
      } else if (err.message.includes("Balance too low for creation.")) {
        inAppAlert.NeedBalance();
      } else if (err.message.includes("Node creation not authorized yet")) {
        inAppAlert.NotAuthorized();
      } else if (
        err.message.includes("futur and rewardsPool cannot create node")
      ) {
        inAppAlert.NotFutur();
      } else if (err.message.includes("Max already reached")) {
        inAppAlert.MaxReached();
      } else if (
        err.message.includes(
          "MetaMask Tx Signature: User denied transaction signature."
        )
      ) {
        inAppAlert.UserReject();
      } else {
        inAppAlert.OtherError();
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

  public async onBuy() {
    try {
      alert("buy");
    } catch (err: any) {
      this.onError(err);
    }
  }

  get dataBlocks() {
    const { cost, quantity } = this;

    return [{ key: "Cost:", value: cost * quantity, unit: "$POLAR" }];
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

.node-video {
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

.node-card__odds {
  font-family: WorkSans;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
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
.node-card__odds__outlined {
  width: 100%;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(0, 198, 237, 0);
}
.node-card__outlined {
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
