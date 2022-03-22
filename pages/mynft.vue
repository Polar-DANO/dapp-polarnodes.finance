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
      <NodeTable :items="myNodeData" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Mynft extends Vue {
  public nodeStation = [
    {
      icon: require('../assets/img/nodesIcon/totalnodes_icon.svg'),
      title: 'Pending Rewards',
      price: '0',
      percentage: '0'
    },
    {
      icon: require('../assets/img/nodesIcon/mynodes_icon.svg'),
      title: 'My Nodes',
      price: '0',
      percentage: '0'
    },
    {
      icon: require('../assets/img/nodesIcon/polarbalance_icon.svg'),
      title: 'My $POLAR Balance',
      price: '0',
      percentage: '0'
    }
  ]
}
</script>
