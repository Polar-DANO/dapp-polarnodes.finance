<template>
  <div class="flex flex-col md:flex-row md:justify-between gap-2">
    <div class="flex flex-col md:flex-row gap-[6px] md:w-[30%]">
      <v-select
        v-model="selectedNftTypes"
        :items="nftTypesSelect"
        label="Filter by NFT Type"
        multiple
        dark
        class="my-0 border-solid border-[#00C6ED] border-[2px] rounded-[14px] px-[10px] md:w-[60%]"
        hide-details
      />
      <v-select
        v-model="selectedView"
        :items="views"
        label="Selected view"
        dark
        class="my-0 border-solid border-[#00C6ED] border-[2px] rounded-[14px] px-[10px] md:w-[40%]"
        hide-details
      />
    </div>
    <VSpacer />
    <div class="flex justify-end items-center gap-4">
      <div
        class="border-solid rounded-[14px] border-[#00C6ED] border-[2px] p-[15px]"
      >
        <span class="text-[white] text-[14px]">Floor Price:</span>
        <span class="text-[white] text-[14px]">5 POLAR </span>
      </div>
      <div
        class="border-solid rounded-[14px] border-[#00C6ED] border-[2px] p-[15px]"
      >
        <span class="text-[white] text-[14px]">Volume:</span>
        <span class="text-[white] text-[14px]">100 POLAR</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { NFTType } from '~/models/marketplace'
import { NFTTypeFilter, ViewType } from '~/store/marketplace/view/state'

@Component({
  watch: {
    selectedNftTypes: {
      handler: 'onSelectedNftTypesChange'
    },
    selectedView: {
      handler: 'onSelectedViewChange'
    }
  }
})
export default class SortList extends Vue {
  // selectedNftTypes: NFTTypeFilter[] = []
  selectedView: ViewType = ViewType.Latest

  get selectedNftTypes () {
    return []
  }

  set selectedNftTypes (filters) {
    this.$store.commit('marketplace/view/setFilter', filters)
  }

  onSelectedViewChange () {
    this.$store.commit('marketplace/view/setView', this.selectedView)
  }

  get nftTypesSelect () {
    const wrapTextValue = (type: NFTType) =>
      (val: string): { text: string, value: NFTTypeFilter } =>
        ({ text: val, value: { type, name: val } })

    const luckyBoxes = (this.$store.getters['luckyboxes/typesNames'] ?? []).map(wrapTextValue(NFTType.LuckyBox))
    const nodeTypes = (this.$store.getters['nodes/nodeTypesNames'] ?? []).map(wrapTextValue(NFTType.Node))

    return [
      { header: 'Luckyboxes' },
      ...luckyBoxes,
      { header: 'Nodes' },
      ...nodeTypes
    ]
  }

  get views () {
    return [
      { text: 'Latest deals', value: ViewType.Latest },
      { text: 'My NFTs', value: ViewType.MyNFTs },
      { text: 'Value (desc)', value: ViewType.DescValue },
      { text: 'Expiring soon', value: ViewType.ExpiringSoon }
    ]
  }
}
</script>
