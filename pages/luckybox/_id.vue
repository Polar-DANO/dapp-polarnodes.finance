<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[100px]"
  >
    <div class="node-card__header d-flex">
      <div>Buy {{ name }} 📦</div>
      <VSpacer />
      <VIcon class="ml-auto pointer" color="white" @click="onClose">
        mdi-close
      </VIcon>
    </div>
    <div class="mt-8 mb-16 mx-16">
      <div class="node-card__subtitle">
        Buy a Lucky Box with $POLAR tokens for your chance to win a random
        Mountain NFT!
      </div>
      <VRow justify="space-between" class="mt-8">
        <VCol cols="12" md="6" class="d-flex align-center flex-col">
          <video class="inline-block node-video" autoplay loop>
            <source
              :src="video"
              type="video/mp4"
            >
            Your browser does not support the video tag.
          </video>
          <div class="mt-8 d-flex align-center node-card__details__options">
            <VCheckbox
              v-model="isOtherUser"
              hide-details
              class="mr-1"
              color="#00c6ed"
            />
            Offer this Lucky Box to a friend
          </div>
          <div class="mt-1 d-flex align-center node-card__details__options">
            <VCheckbox
              v-model="isCreatorCode"
              hide-details
              class="mr-1"
              color="#00c6ed"
            />
            Use Creator code
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <div class="text-center">
            <div class="node-card__odds">
              Biggest nodes in this box:
            </div>
            <div class="node-card__odds__outlined py-4 inline-block mt-2">
              <VRow
                v-for="(chance, key) in topOdds"
                :key="key"
                justify="center"
                no-gutters
              >
                <VCol class="text-center font-bold">
                  {{ chance.name }}
                </VCol>
              </VRow>
            </div>

            <div class="node-card__odds mt-2">
              Minimum node type guaranteed:
            </div>
            <div class="node-card__odds__outlined py-4 inline-block mt-2">
              <VRow
                justify="center"
                no-gutters
              >
                <VCol class="text-center font-bold">
                  {{ mostCommonType.name }} : {{ mostCommonType.probability }}%
                </VCol>
              </VRow>
            </div>

            <div class="node-card__odds mt-4">
              Pay with:
            </div>
            <VSelect
              v-model="selectedToken"
              class="node-card__outlined node-card__select centered-input mt-2"
              width="200px"
              placeholder="Buy With"
              dense
              hide-details
              outlined
              :items="payWithTokens"
            />

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

              <VRow v-if="isOtherUser">
                <VTextField
                  v-model="otherUser"
                  dark
                  label="Your Friend's Address"
                />
              </VRow>

              <VRow v-if="isCreatorCode">
                <VTextField
                  v-model="creatorCode"
                  dark
                  label="Creator code"
                />
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
              :loading="isBtnLoading"
              :disabled="!canCreate"
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
import { Component } from 'nuxt-property-decorator';
import * as ethers from 'ethers';
import * as LuckyBox from '~/models/luckybox-type';
import WalletReactiveFetch, {
  IReactiveFetch
} from '~/mixins/wallet-reactive-fetch';
import addresses from '~/config/addresses';
import { LUCKYBOX_INDEX_TO_VIDEO } from '~/models/constants';

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

@Component({
  watch: {
    selectedToken: { handler: 'onSelectedTokenChange' },
  },
})
export default class Create
  extends WalletReactiveFetch
  implements IReactiveFetch {
  private quantity = 1;
  private selectedToken = addresses.Token;
  private isBtnLoading = false;
  private isOtherUser = false;
  private otherUser = '';
  private isCreatorCode = false;
  private creatorCode: string | null = null;

  get otherUserValid () {
    return ADDRESS_REGEX.test(this.otherUser);
  }

  get canCreate () {
    return (
      this.quantity >= 1 &&
      (this.isOtherUser ? ADDRESS_REGEX.test(this.otherUser) : true)
    );
  }

  get payWithTokens () {
    return Object.values(this.$store.state.tokens.tokens).map((token: any) => {
      return {
        text: token.symbol,
        value: token.address,
      };
    });
  }

  get isApprove () {
    return !this.$store.getters['tokens/hasEnoughSwapperAllowance'](
      this.selectedToken,
      this.totalCost
    );
  }

  get luckyBox () {
    return this.$store.getters['luckyboxes/typeById'](this.$route.params.id);
  }

  get video () {
    return (LUCKYBOX_INDEX_TO_VIDEO as any)[this.$route.params.id];
  }

  get chances () {
    if (!this.luckyBox) {
      return [];
    }

    return LuckyBox.getPossibleTypes(this.luckyBox);
  }

  get topOdds () {
    return this.chances.slice(-3);
  }

  get mostCommonType () {
    return this.chances[0];
  }

  onClose () {
    this.$router.push('/nodes#lucky-box');
  }

  async reactiveFetch () {
    if (this.isWalletConnected) {
      await Promise.all([
        this.$store.dispatch(
          'tokens/loadAllowance',
          this.selectedToken
        ),
        this.$store.dispatch('luckyboxes/loadLuckyBoxTypes'),
      ]);

      if (!this.luckyBox) {
        this.$router.push('/nodes');
      }
    }
  }

  async onSelectedTokenChange () {
    await this.$store.dispatch(
      'tokens/loadAllowance',
      this.selectedToken
    );
  }

  get name () {
    return this.luckyBox?.name;
  }

  get cost () {
    return this.luckyBox?.price;
  }

  get totalCost () {
    return this.cost ? this.cost.mul(this.quantity) : ethers.BigNumber.from(0);
  }

  public onRemove () {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  public onAdd () {
    this.quantity++;
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

  public async onBuy () {
    try {
      this.isBtnLoading = true;
      await this.$store.dispatch('luckyboxes/buy', {
        luckyBox: this.luckyBox,
        amount: this.quantity,
        withToken: this.selectedToken,
        user: this.isOtherUser ? this.otherUser : this.walletAddress,
        sponso: this.isCreatorCode ? this.creatorCode : null,
      });

      this.$router.push('/mynft');
    } finally {
      this.isBtnLoading = false;
    }
  }

  get dataBlocks () {
    return [
      {
        key: 'Cost:',
        value: ethers.utils.formatEther(this.totalCost),
        unit: '$POLAR',
      },
    ];
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
