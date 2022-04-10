<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[100px]"
  >
    <div class="node-card__header d-flex">
      <div>Create {{ nodeNftName }} Mountain 🗻️</div>
      <VSpacer />
      <VIcon class="ml-auto pointer" color="white" @click="onClose">
        mdi-close
      </VIcon>
    </div>
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
                <source :src="video" type="video/mp4">
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
              <VCheckbox
                v-model="isPendingRewardsSelected"
                hide-details
                class="mr-1"
                color="#00c6ed"
              />
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
            <div
              v-if="canOfferToUser"
              class="mt-1 d-flex align-center node-card__details__options"
            >
              <VCheckbox
                v-model="isOtherUser"
                hide-details
                class="mr-1"
                color="#00c6ed"
              />
              Offer this Mountain NFT to a friend
            </div>
            <div
              v-if="canUseCreatorCode"
              class="mt-1 d-flex align-center node-card__details__options"
            >
              <VCheckbox
                v-model="isCreatorCode"
                hide-details
                class="mr-1"
                color="#00c6ed"
              />
              Use Creator code
            </div>
          </div>
        </VCol>
        <VCol cols="12" md="6" class="mt-8">
          <div v-if="createMode === 'FROM_TOKENS'" class="text-center">
            <div class="node-card__outlined pa-5">
              Earn {{ totalDailyEarning }} $POLAR per day
            </div>
            <VSelect
              v-model="selectedToken"
              class="node-card__outlined node-card__select centered-input mt-4"
              width="200px"
              placeholder="Buy With"
              dense
              hide-details
              outlined
              :items="payWithTokens"
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

              <VRow v-if="isOtherUser && canOfferToUser">
                <VTextField
                  v-model="otherUser"
                  dark
                  label="Your Friend's Address"
                />
              </VRow>

              <VRow v-if="isCreatorCode && canUseCreatorCode">
                <VTextField
                  v-model="creatorCode"
                  dark
                  label="Creator code"
                />
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
              :loading="isBtnLoading"
              @click="onApprove"
            >
              Approve
            </VBtn>
            <VBtn
              v-else
              class="node-card__outlined node-card__button pa-2"
              dark
              text
              :disabled="!canCreate"
              :loading="isBtnLoading"
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
              multiple
              hide-details
              outlined
              :items="nfts"
              :value="selectedNfts"
              @input="onSelectedNftInput"
            />

            <VSelect
              class="node-card__outlined node-card__select centered-input mt-4"
              width="200px"
              placeholder="Buy With"
              dense
              hide-details
              outlined
              :items="payWithTokens"
              :value="selectedToken"
              @input="onSelectedTokenInput"
            />

            <div v-if="isLevelUpSelected">
              <div class="mt-4 text-left node-card__danger-text">
                *** WARNING / ATTENTION: ***
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
            </div>

            <div class="node-card__content inline-block">
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
              :loading="isBtnLoading"
              @click="onApprove"
            >
              Approve
            </VBtn>
            <VBtn
              v-else
              class="node-card__outlined node-card__button pa-2"
              dark
              text
              :disabled="quantity < 1 || selectedNfts.length === 0"
              :loading="isBtnLoading"
              @click="onCreate"
            >
              <span v-if="createMode === 'LEVEL_UP'">Level Up</span>
              <span v-else>Create</span>
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import * as ethers from 'ethers';
import { URL_TO_NAME, NODENAME_TO_VIDEO, Url } from '~/models/constants';
import * as NodeType from '~/models/NodeType';
import WalletReactiveFetch, {
  IReactiveFetch
} from '~/mixins/wallet-reactive-fetch';
import { NFT } from '~/models/nft';
import addresses from '~/config/addresses';

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

const CreateMode = {
  FROM_TOKENS: 'FROM_TOKENS',
  FROM_NFT: 'FROM_NFT',
  LEVEL_UP: 'LEVEL_UP',
} as const;

@Component({
  watch: {
    selectedToken: {
      handler: 'reactiveFetch',
    },
    createMode: {
      handler: 'onCreateModeChange',
    },
  },
})
export default class Create
  extends WalletReactiveFetch
  implements IReactiveFetch {
  public quantity = 1;
  public isDetailsOpen = false;
  public createMode: keyof typeof CreateMode = CreateMode.FROM_TOKENS;
  public selectedToken: string = addresses.Token;
  public selectedNfts: NFT[] = [];
  public isBtnLoading = false;
  private isOtherUser = false;
  private isCreatorCode = false;
  private otherUser = '';
  private creatorCode = '';

  onClose () {
    this.$router.push('/nodes');
  }

  onCreateModeChange (createMode: keyof typeof CreateMode) {
    if (createMode !== CreateMode.FROM_TOKENS) {
      this.isOtherUser = false;
      this.isCreatorCode = false;
    }
  }

  get canOfferToUser () {
    return this.createMode === CreateMode.FROM_TOKENS;
  }

  get canUseCreatorCode () {
    return this.createMode === CreateMode.FROM_TOKENS;
  }

  get availableTokens () {
    return this.$store.state.tokens.tokens;
  }

  created () {
    if (!this.nodeNftName) {
      this.$router.push('/nodes');
    }
  }

  async reactiveFetch () {
    if (!this.isWalletConnected) {
      return;
    }
    await {
      allowance: await this.$store.dispatch(
        'tokens/loadAllowance',
        this.selectedToken
      ),
      nodes: await (async () => {
        await this.$store.dispatch('nodes/loadNodeTypes');
        await this.$store.dispatch('nft/loadMyNFTs');
      })(),
    };
  }

  public get isLevelUpSelected () {
    return this.createMode === CreateMode.LEVEL_UP;
  }

  public set isLevelUpSelected (newVal: boolean) {
    this.createMode = newVal ? CreateMode.LEVEL_UP : CreateMode.FROM_TOKENS;
  }

  public get isPendingRewardsSelected () {
    return this.createMode === CreateMode.FROM_NFT;
  }

  public set isPendingRewardsSelected (newVal: boolean) {
    this.createMode = newVal ? CreateMode.FROM_NFT : CreateMode.FROM_TOKENS;
  }

  get nodeType () {
    return this.$store.getters['nodes/nodeTypeByName'](this.nodeNftName);
  }

  get dailyEarningPerNode () {
    return this.nodeType ? NodeType.dailyRewardPerNode(this.nodeType) : null;
  }

  get cost () {
    return this.nodeType?.cost;
  }

  get tax () {
    return this.nodeType?.claimTax;
  }

  get totalCreatedNodes () {
    return this.nodeType?.totalCreatedNodes;
  }

  get maxSlots () {
    return this.nodeType?.maxSlots;
  }

  get maxCreationPendingGlobal () {
    return this.nodeType?.maxCreationPendingGlobal;
  }

  get maxCreationPendingUser () {
    return this.nodeType?.maxCreationPendingUser;
  }

  get maxLevelUpGlobal () {
    return this.nodeType?.maxLevelUpGlobal;
  }

  get maxLevelUpUser () {
    return this.nodeType?.maxLevelUpUser;
  }

  get nodeNftName () {
    return URL_TO_NAME[this.$route.params.id as Url];
  }

  get video () {
    return NODENAME_TO_VIDEO[this.nodeNftName];
  }

  public onSelectedTokenInput (token: string) {
    this.selectedToken = token;
  }

  get payWithTokens () {
    return Object.values(this.$store.state.tokens.tokens).map((token: any) => {
      return {
        text: token.symbol,
        value: token.address,
      };
    });
  }

  public onSelectedNftInput (nfts: NFT[]) {
    this.selectedNfts = nfts;
  }

  get nfts () {
    return this.$store.getters['nft/myNFTsByNodeType']?.flatMap(
      ({ nodeType, nfts }: { nodeType: string; nfts: NFT[] }) => {
        if (!nfts?.length) {
          return [];
        }

        return [
          { header: nodeType },
          ...nfts.map(nft => ({
            text: `${nodeType} #${nft.tokenId}`,
            value: { ...nft, nodeType },
          })),
        ];
      }
    );
  }

  public onRemove () {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  public onAdd () {
    this.quantity++;
  }

  get canCreate () {
    return (
      this.quantity >= 1 &&
      (this.isOtherUser ? ADDRESS_REGEX.test(this.otherUser) : true)
    );
  }

  get isApprove () {
    return !this.$store.getters['tokens/hasEnoughSwapperAllowance'](
      this.selectedToken,
      this.totalCost
    );
  }

  public async onApprove () {
    try {
      this.isBtnLoading = true;
      await this.$store.dispatch(
        'tokens/requestSwapperAllowance',
        this.selectedToken
      );
    } finally {
      this.isBtnLoading = false;
    }
  }

  public async onCreate () {
    try {
      this.isBtnLoading = true;

      if (this.createMode === CreateMode.FROM_TOKENS) {
        await this.$store.dispatch('nodes/createNodesFromToken', {
          nodeTypeName: this.nodeNftName,
          count: this.quantity,
          token: this.selectedToken,
          user: this.isOtherUser ? this.otherUser : this.walletAddress,
          sponso: this.isCreatorCode ? this.creatorCode : null,
        });

        this.$router.push('/mynft');
      }

      if (this.createMode === CreateMode.FROM_NFT) {
        await this.$store.dispatch('nodes/createNodesWithPendingRewards', {
          selectedNodes: this.selectedNfts,
          tokenOut: this.selectedToken,
          nodeTypeTo: this.nodeNftName,
          count: this.quantity,
        });

        this.$router.push('/mynft');
      }

      if (this.createMode === CreateMode.LEVEL_UP) {
        await this.$store.dispatch('nodes/createNodesLevelUp', {
          selectedNodes: this.selectedNfts,
          tokenOut: this.selectedToken,
          nodeTypeTo: this.nodeNftName,
          count: this.quantity,
        });

        this.$router.push('/mynft');
      }
    } finally {
      this.isBtnLoading = false;
    }
  }

  get totalCost () {
    return this.cost?.mul(this.quantity) ?? ethers.BigNumber.from(0);
  }

  get dataBlocks () {
    const { totalCost, roi, tax } = this;
    if (!this.nodeType) {
      return [];
    }
    return [
      {
        key: 'Cost:',
        value: ethers.utils.formatEther(totalCost),
        unit: '$POLAR',
      },
      { key: 'ROI / day:', value: roi.toFixed(2), unit: '%' },
      { key: 'Claim Tax:', value: tax, unit: '%' },
    ];
  }

  get detailsBlocks () {
    if (!this.nodeType) {
      return [];
    }
    return [
      {
        key: 'Max Slots:',
        value: `${this.totalCreatedNodes} / ${this.maxSlots}`,
      },
      { key: 'Max Level Up User:', value: this.maxLevelUpUser },
      { key: 'Max Level Up Global:', value: this.maxLevelUpGlobal },
      { key: 'Max Creation Pending User:', value: this.maxCreationPendingUser },
      {
        key: 'Max Creation Pending Global:',
        value: this.maxCreationPendingGlobal,
      },
    ];
  }

  get totalDailyEarning () {
    if (!this.nodeType) {
      return 0;
    }
    const { quantity, dailyEarningPerNode } = this;
    return parseFloat(
      ethers.utils.formatEther(dailyEarningPerNode?.mul(quantity) ?? 0)
    ).toFixed(2);
  }

  get roi () {
    if (!this.nodeType) {
      return 0;
    }
    return NodeType.roi(this.nodeType);
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
