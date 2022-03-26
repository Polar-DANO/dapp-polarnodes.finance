<template>
  <div class="flex flex-col md:mx-[197px] mx-[10%] mt-[30px] md:mt-4">
    <span class="text-[24px] text-white">Node Station 🚉️</span>
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
    <span class="mt-[64px] text-[24px] text-white">Create Node 🗻️</span>
    <div
      v-if="nodeNames && nodeNames.length > 0"
      class="md:flex flex-wrap gap-2 md:gap-[12px] my-[32px]"
      style="color: white"
    >
      <NodeNft
        v-for="(node, i) of nodeNames"
        :key="`${node}-${i}`"
        :name="node"
      />
    </div>
    <div
      v-else
      class="md:flex flex-wrap gap-2 md:gap-[12px] my-[32px]"
      style="color: white"
    >
      <NodeNftLoading v-for="index of 5" :key="`loading-node-${index}`" />
    </div>
    <span class="mt-[64px] text-[24px] text-white">Node Lucky Boxes 📦️</span>
    <div
      class="md:flex flex-wrap gap-2 md:gap-[24px] my-[32px]"
      style="color: white"
    >
      <NodeNftLuckyBox
        v-for="({ id, name, price }) of luckyBoxesList"
        :key="`${name}-${id}`"
        :index="id"
        :name="name"
        :cost="price"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Nodes extends Vue {
  get nodeStation () {
    return [
      {
        icon: require('../assets/img/nodesIcon/totalnodes_icon.svg'),
        title: 'Total Nodes',
        price: this.$store.getters['nodes/totalCreated'],
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

  get luckyBoxesList () {
    return this.$store.state.luckyboxes.luckyBoxTypes ?? []
  }

  get nodeNames () {
    return this.$store.getters['nodes/nodeTypesNames']
  }

  async fetch () {
    await this.$store.dispatch('wallet/loadAddress')
    this.$store.dispatch('polar/loadBalance')
    this.$store.dispatch('nodes/loadNodeTypes')
    this.$store.dispatch('luckyboxes/loadLuckyBoxTypes')
  }
}
</script>
