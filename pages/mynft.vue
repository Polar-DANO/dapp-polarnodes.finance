<template>
  <div class="flex flex-col md:mx-[197px] mx-[10%] mt-[30px] md:mt-[123px]">
    <span class="text-[24px] text-white">My NFTs 🗻</span>
    <div class="md:flex flex-wrap gap-2 md:gap-[24px] mt-[32px]">
      <DataTable
        v-for="(item, i) in nodeStation"
        :key="i"
        :title="item.title"
        :icon="item.icon"
        :price="item.price"
        :percentage="item.percentage"
      />
    </div>
    <div class="md:mt-[40px]">
      <MyLuckyBoxesTable v-if="luckyBoxes.length > 0" :items="luckyBoxes" />
      <NodeTable :items="nfts" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Mynft extends Vue {
  get nodeStation () {
    return [
      {
        icon: require('../assets/img/nodesIcon/totalnodes_icon.svg'),
        title: 'Pending Rewards',
        price: this.$store.getters['nodes/totalPendingRewards'],
        percentage: null
      },
      {
        icon: require('../assets/img/nodesIcon/mynodes_icon.svg'),
        title: 'My Nodes',
        price: this.$store.getters['nodes/myTotalCreated'],
        percentage: null
      },
      {
        icon: require('../assets/img/nodesIcon/polarbalance_icon.svg'),
        title: 'My $POLAR Balance',
        price: this.$store.state.polar.balance,
        percentage: null
      }
    ]
  }

  get nfts () {
    return this.$store.getters['nft/byCreationDateDesc'] ?? []
  }

  get luckyBoxes () {
    return this.$store.state.luckyboxes.myLuckyBoxes ?? []
  }

  async fetch () {
    await this.$store.dispatch('wallet/loadAddress')

    this.$store.dispatch('luckyboxes/loadLuckyBoxTypes')
    this.$store.dispatch('luckyboxes/loadMyLuckyBoxes')
    this.$store.dispatch('polar/loadBalance')

    await this.$store.dispatch('nodes/loadNodeTypes')
    this.$store.dispatch('nft/loadNFTs')
  }
}
</script>
