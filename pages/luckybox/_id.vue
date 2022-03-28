<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[100px]"
  >
    <div class="node-card__header">
      Buy {{ name }} 📦
    </div>
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
            >
            Your browser does not support the video tag.
          </video>
        </VCol>
        <VCol cols="12" md="6">
          <div class="text-center">
            <div class="node-card__odds">
              Odds:
            </div>
            <div class="node-card__odds__outlined py-4 inline-block mt-2">
              <VRow
                v-for="chance in chances"
                :key="chance.key"
                justify="center"
                no-gutters
              >
                <VCol class="text-right">
                  {{ chance.key }}:
                </VCol>
                <VDivider vertical dark class="mx-4" />
                <VCol class="text-left">
                  {{ chance.value }}% Chance
                </VCol>
              </VRow>
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
import { Component } from 'nuxt-property-decorator'
import * as ethers from 'ethers'
import * as LuckyBox from '~/models/luckybox-type'
import WalletReactiveFetch, { IReactiveFetch } from '~/mixins/wallet-reactive-fetch'
import { Token as Polar } from '~/hardhat/scripts/address'

@Component({})
export default class Create extends WalletReactiveFetch implements IReactiveFetch {
  private quantity = 1
  private selectedToken = Polar
  private isBtnLoading = false

  get payWithTokens () {
    return Object.values(this.$store.state.tokens.tokens).map((token: any) => {
      return {
        text: token.symbol,
        value: token.address
      }
    })
  }

  get isApprove () {
    return !this.$store.getters['tokens/hasEnoughSwapperAllowance'](this.selectedToken, this.totalCost)
  }

  get luckyBox () {
    return this.$store.getters['luckyboxes/typeById'](this.$route.params.id)
  }

  get chances () {
    return this.luckyBox
      ? LuckyBox
        .computeProbabilities(this.luckyBox)
        .map(item => ({ key: item.nodeType, value: item.probability }))
      : []
  }

  async reactiveFetch () {
    if (this.isWalletConnected) {
      await this.$store.dispatch('luckyboxes/loadLuckyBoxTypes')
      if (!this.luckyBox) {
        this.$router.push('/nodes')
      }
    }
  }

  get name () {
    return this.luckyBox?.name
  }

  get cost () {
    return this.luckyBox?.price
  }

  get totalCost () {
    return this.cost ? this.cost.mul(this.quantity) : ethers.BigNumber.from(0)
  }

  public onRemove () {
    if (this.quantity > 1) {
      this.quantity--
    }
  }

  public onAdd () {
    this.quantity++
  }

  public async onApprove () {
    try {
      this.isBtnLoading = true
      await this.$store.dispatch('tokens/requestSwapperAllowance', this.selectedToken)
    } finally {
      this.isBtnLoading = false
    }
  }

  public async onBuy () {
    try {
      this.isBtnLoading = true
      await this.$store.dispatch('luckyboxes/buy', {
        luckyBox: this.luckyBox,
        amount: this.quantity,
        withToken: this.selectedToken
      })

      this.$router.push('/mynft')
    } finally {
      this.isBtnLoading = false
    }
  }

  get dataBlocks () {
    return [{ key: 'Cost:', value: ethers.utils.formatEther(this.totalCost), unit: '$POLAR' }]
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
