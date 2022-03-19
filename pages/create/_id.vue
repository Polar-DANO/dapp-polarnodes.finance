<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[100px]"
  >
    <div class="node-card__header">Create {{ nodeNftName }} Mountain 🗻️</div>
    <div class="mt-8 mb-16 mx-16">
      <div class="node-card__subtitle">
        Create a Mountain with $POLAR tokens to earn lifetime high-yield token
        rewards!
      </div>
      <VRow justify="space-between">
        <VCol cols="12" md="6" class="d-flex align-center justify-center mt-8">
          <div class="full-height">
            <div
              v-if="!isDetailsOpen"
              class="inline-block node-video__container"
            >
              <video class="node-video" autoplay loop muted>
                <source :src="video" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div
                class="text-center mt-2 node-card__details pointer"
                @click="isDetailsOpen = true"
              >
                <VIcon large color="#00c6ed" class="mr-1">
                  mdi-arrow-right-drop-circle-outline
                </VIcon>
                View All Details
              </div>
            </div>
            <div
              v-else
              class="inline-block node-video__container"
              style="width: 100%"
            >
              <VRow
                v-for="db in detailsBlocks"
                :key="db.key"
                justify="center"
                class="my-2 ml-0 node-card__data-block node-card__details-block"
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
              <div
                class="text-center mt-5 node-card__details pointer"
                @click="isDetailsOpen = false"
              >
                <VIcon large color="#00c6ed" class="mr-1">
                  mdi-arrow-left-drop-circle-outline
                </VIcon>
                Go Back To Main
              </div>
            </div>
            <div class="mt-8 d-flex align-center node-card__details__options">
              <VCheckbox hide-details class="mr-1" color="#00c6ed" />
              Create this Mountain NFT with Pending Rewards
            </div>
            <div class="mt-1 d-flex align-center node-card__details__options">
              <VCheckbox
                v-model="isLevelUpSelected"
                hide-details
                class="mr-1"
                color="#00c6ed"
              />
              Create this Mountain NFT by ‘Leveling Up’ Existing NFTs
            </div>
          </div>
        </VCol>
        <VCol cols="12" md="6" class="mt-8">
          <div v-if="!isLevelUpSelected" class="text-center">
            <div class="node-card__outlined pa-5">
              Earn {{ dailyEarning }} $POLAR per day
            </div>
            <VSelect
              class="node-card__outlined node-card__select centered-input mt-4"
              width="200px"
              placeholder="Buy With"
              dense
              hide-details
              outlined
            />
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
          <div v-else class="text-center">
            <div class="pb-5 text-left node-card__levelup__title">
              Select Mountain NFT(s) To Exchange:
            </div>

            <VSelect
              class="node-card__outlined centered-input mt-4"
              placeholder="Select Mountain NFT(s)"
              dense
              hide-details
              outlined
            />

            <div class="mt-4 text-left node-card__danger-text">
              *** WARNING / ATTENTION: ***
            </div>
            <div class="mt-4 text-left node-card__danger-text">
              Leveling up an NFT will make it lose any existing pending rewards!
            </div>
            <div class="mt-4 text-left node-card__danger-text">
              Please count the number of NFTs you want to exchange. If you
              select more than the price of the target NFT, you will lose the
              excess NFTs.
            </div>
            <div class="mt-4 mb-8 text-left node-card__danger-text">
              Make sure that the total amount of NFTs you exchange corresponds
              to the price of the target NFT. Be careful!
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
              @click="onLevelUp"
            >
              Level Up
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
import { URL_TO_NAME, NODENAME_TO_VIDEO, Url } from "~/models/constants";

const ethers = require("ethers");
const { Token, PolarToken, Owner } = require("~/hardhat/scripts/address.js");

@Component({})
export default class Create extends Vue {
  public nodeNftName: NodeNftNames | null = null;
  public quantity = 1;
  public isApprove = true;
  public isDetailsOpen = false;
  public isLevelUpSelected = false;
  public video: string | null = null;

  private dailyEarningPerNode = 0;
  private cost = 0;
  private tax: number | null = null;
  private polar: any;
  private pnode: any;

  private async created() {
    const nodeNftName = URL_TO_NAME[this.$route.params.id as Url];
    this.video = NODENAME_TO_VIDEO[nodeNftName];

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

  public async onCreate() {
    try {
      await this.pnode.createNodeWithTokens(this.nodeNftName, this.quantity);
    } catch (err: any) {
      this.onError(err);
    }
  }

  public onLevelUp() {
    alert("level up");
  }

  get dataBlocks() {
    const { cost, roi, tax, quantity } = this;
    return [
      { key: "Cost:", value: cost * quantity, unit: "$POLAR" },
      { key: "ROI / day:", value: roi, unit: "%" },
      { key: "Claim Tax:", value: tax, unit: "%" },
    ];
  }

  get detailsBlocks() {
    return [
      { key: "Max Slots:", value: "0 / 0" },
      { key: "Max Level Up User:", value: 0 },
      { key: "Max Level Up Global:", value: 0 },
      { key: "Max Creation Pending User:", value: 0 },
      { key: "Max Creation Pending Global:", value: 0 },
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

.node-video {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
  height: 100%;
}

.node-video__container {
  height: 300px;
  width: 100%;
  margin: auto;
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

.node-card__details {
  font-size: 18px;
  font-weight: 600;
}

.node-card__details__options {
  font-size: 14px;
  font-weight: 500;
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
  width: 100%;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  font-size: 16px;
  font-weight: 600;
  background-color: rgba(0, 198, 237, 0);
}

.node-card__select {
  max-width: 200px;
  margin: auto;
}

.node-card__content {
  width: 200px;
}

.node-card__details-block {
  max-width: 300px;
  margin-left: auto !important;
  margin-right: auto !important;
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

.node-card__levelup__title {
  font-size: 16px;
  font-weight: 600;
}

.node-card__danger-text {
  font-size: 14px;
  font-weight: 600;
  color: #f00;
}
</style>
