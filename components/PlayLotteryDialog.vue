<template>
  <v-dialog
    dark
    :value="true"
    max-width="800"
    @click:outside="$emit('close')"
  >
    <v-card>
      <v-card-title class="text-h5 primary">
        Win up to
        <span class="text-h4 font-weight-black mx-2">100x</span>
        your bet
        <v-spacer />
        <v-icon class="pointer-cursor" @click="$emit('close')">
          mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text class="mt-4 text-white">
        <v-radio-group
          v-model="buyOption"
        >
          <div class="d-flex align-start">
            <v-radio
              v-for="option in availableBuyOptions"
              :key="option"
              :label="labelByOption[option]"
              :value="option"
              class="mx-auto"
            />
          </div>
        </v-radio-group>
        <div class="d-flex align-center">
          <div class="text-h6">
            Amount of Tickets
          </div>
          <v-spacer />
          <div class="d-flex align-center justify-center">
            <v-btn
              :disabled="ticketsNb === 1"
              small
              rounded
              color="#00c6ed"
              dark
              @click="ticketsNb--"
            >
              -
            </v-btn>
            <div class="mx-auto">
              <VTextField
                v-model.number="ticketsNb"
                dark
                class="centered-input"
              />
            </div>
            <v-btn small rounded color="#00c6ed" dark @click="ticketsNb++">
              +
            </v-btn>
          </div>
        </div>

        <div v-if="buyOption === BuyOption.Tokens">
          <div class="d-flex align-center">
            <div class="text-h6">
              Token to use
            </div>
            <v-spacer />
            <v-select
              v-model="options.tokenContractAddress"
              dense
              outlined
              item-text="name"
              item-value="contract"
              :items="availableTokens"
              hide-details
            />
          </div>
          <div class="d-flex align-center mt-4">
            <div class="text-h6">
              Buy tickets for someone else
            </div>
            <v-spacer />
            <v-checkbox
              v-model="isBuyForSomeoneElseActive"
              dense
              outlined
              hide-details
            />
          </div>
          <div v-if="isBuyForSomeoneElseActive" class="d-flex align-center mt-4">
            <div class="text-h6">
              Wallet Address
            </div>
            <v-spacer />
            <VTextField
              v-model="options.inputUserWallet"
              dense
              outlined
              hide-details
            />
          </div>
        </div>
        <div v-else class="text-h6">
          <div class="d-flex align-center mt-4">
            <div class="text-h6">
              Node
            </div>
            <v-spacer />
            <v-select
              dense
              outlined
              multiple
              chips
              deletable-chips
              item-text="nodeType"
              return-object
              :items="myNodeNfts"
              hide-details
              @change="onNodeNftsSelect"
            >
              <template #item="{ item }">
                <v-checkbox
                  :key="item.nodeType"
                  class="mr-2"
                  :value="options.tokenIdsToClaim.flat().includes(item.tokenId)"
                  color="primary"
                  hide-details
                />
                <div class="d-flex align-center">
                  <div>
                    #{{ item.tokenId }} {{ item.nodeType }}
                  </div>
                  <div class="ml-2">
                    ({{ item.userPendingRewards.toFixed(3) }} $POLAR pending rewards)
                  </div>
                </div>
              </template>
            </v-select>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          class="text-none"
          color="primary"
          text
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          class="text-none"
          color="primary"
          @click="onPlay"
        >
          Buy Tickets
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { utils } from 'ethers';
import { Draw, BuyOption } from '@/pages/lottery.vue';
import addresses from '@/config/addresses';

@Component({
  props: {
    draw: Object as () => Draw,
  },
})
export default class PlayLotteryDialog extends Vue {
  public ticketsNb: number = 1;
  public buyOption: BuyOption = BuyOption.Tokens;

  public availableTokens = [
    { name: 'POLAR', contract: addresses.Token },
    { name: 'DAI.e', contract: addresses.Dai },
  ];

  public BuyOption = BuyOption;
  public isBuyForSomeoneElseActive: boolean = false;

  public options = {
    tokenContractAddress: addresses.Token,
    inputUserWallet: null,
    tokenOut: addresses.Token,
    nameFrom: [],
    tokenIdsToClaim: [],
  };

  public labelByOption = {
    [BuyOption.Tokens]: 'Tokens 📈',
    [BuyOption.Pending]: 'Pending ⏲',
    [BuyOption.Burning]: 'Burning 🔥',
  };

  onPlay () {
    const { ticketsNb, buyOption, options } = this;
    this.$emit('play', buyOption, ticketsNb, options);
  }

  onNodeNftsSelect (nodes: { nodeType: string, tokenId: number }[]) {
    const { nameFrom, tokenIdsToClaim } = nodes.reduce((acc, node) => {
      const index = acc.nameFrom.indexOf(node.nodeType);
      if (index === -1) {
        acc.nameFrom.push(node.nodeType);
        acc.tokenIdsToClaim.push([node.tokenId]);
      } else {
        acc.tokenIdsToClaim[index](node.tokenId);
      }
      return acc;
    }, { nameFrom: [], tokenIdsToClaim: [] });

    this.options.nameFrom = nameFrom;
    this.options.tokenIdsToClaim = tokenIdsToClaim;
  }

  get availableBuyOptions (): BuyOption[] {
    const { draw } = this;

    if (!draw) {
      return [];
    }
    return [
      ...(draw.withTokens ? [BuyOption.Tokens] : []),
      ...(draw.withPending ? [BuyOption.Pending] : []),
      ...(draw.withBurning ? [BuyOption.Burning] : []),
    ];
  }

  get myNodeNfts () {
    const nodeNfts = this.$store.getters['nft/myNFTsByCreationDateDesc'];
    return nodeNfts.map(nft => ({
      ...nft,
      tokenId: nft.tokenId.toNumber(),
      userPendingRewards: parseFloat(utils.formatEther(nft.userPendingRewards)),
    }));
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
