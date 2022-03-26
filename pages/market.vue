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
      @close="isModalOpen = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Market extends Vue {
  private selectedItem = null

  get isModalOpen () {
    return this.selectedItem !== null
  }

  get items () {
    return this.$store.getters['marketplace/items']
  }

  private onClick (item) {
    this.selectedItem = item
  }

  async fetch () {
    await this.$store.dispatch('wallet/loadAddress')
    await this.$store.dispatch('marketplace/load')
  }
}
</script>
