<template>
  <div class="flex flex-col md:mx-[164px] mx-[10%] mt-[30px] md:mt-[84px]">
    <span class="text-[24px] text-[#FFFFFF] ml-[3px] mb-[32px]">
      Polar NFT Market 🛒
    </span>
    <SortList />
    <div v-if="items.length" class="d-flex flex-wrap gap-4 mt-[30px]">
      <ItemCard
        v-for="(item) in items"
        :key="`${item.nft.tokenId}-${item.nft.nftType}`"
        :item="item"
        @click="onClick(item)"
      />
    </div>
    <div v-else>
      <v-alert
        type="info"
        class="mt-[30px]"
        :value="true"
        dismissible
        outlined
        dark
      >
        No items found matching your search.
      </v-alert>
    </div>
    <ItemDetailsModal
      v-if="isModalOpen"
      :item="selectedItem"
      @close="() => selectedItem = null"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import WalletReactiveFetch, { IReactiveFetch } from '~/mixins/wallet-reactive-fetch';
import { Item } from '~/models/marketplace';
import addresses from '~/config/addresses'

@Component
export default class Market extends WalletReactiveFetch implements IReactiveFetch {
  private selectedItem: Item | null = null;

  get isModalOpen () {
    return this.selectedItem !== null;
  }

  get items () : Item[] {
    return this.$store.getters['marketplace/view/current'];
  }

  private onClick (item: Item) {
    this.selectedItem = item;
  }

  async reactiveFetch () {
    await Promise.all([
      this.$store.dispatch('marketplace/load'),
      this.$store.dispatch('nodes/loadNodeTypes'),
      this.$store.dispatch('luckyboxes/loadLuckyBoxTypes'),
      ...(
        (this.isWalletConnected)
          ? [
              this.$store.dispatch('tokens/loadAllowance', addresses.Token),
            ]
          : []),
    ]);
  }
}
</script>
