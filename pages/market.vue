<template>
  <div class="flex flex-col md:mx-[164px] mx-[10%] mt-[30px] md:mt-[84px]">
    <span class="text-[24px] text-[#FFFFFF] ml-[3px] mb-[32px]">
      Polar NFT Market 🛒
    </span>
    <SortList />
    <div class="grid md:grid-cols-4 gap-4 mt-[30px]">
      <ItemCard
        v-for="(item, i) in items"
        :key="i"
        :item="item"
        @click="onClick(item)"
      />
    </div>
    <ItemDetailsModal
      v-if="isModalOpen"
      :data-detail="selectedItem"
      @close="() => selectedItem = null"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import WalletReactiveFetch, { IReactiveFetch } from '~/mixins/wallet-reactive-fetch'
import { Item } from '~/models/marketplace'

@Component
export default class Market extends WalletReactiveFetch implements IReactiveFetch {
  private selectedItem: Item | null = null

  get isModalOpen () {
    return this.selectedItem !== null
  }

  get items () : Item[] {
    return this.$store.getters['marketplace/items']
  }

  private onClick (item: Item) {
    this.selectedItem = item
  }

  async reactiveFetch () {
    if (this.isWalletConnected) {
      await this.$store.dispatch('marketplace/load')
    }
  }
}
</script>
