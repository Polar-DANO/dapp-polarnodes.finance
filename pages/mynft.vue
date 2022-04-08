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
      <MigrationTable />
    </div>
    <div class="md:mt-[40px]">
      <MyLuckyBoxesTable v-if="luckyBoxes.length > 0" :items="luckyBoxes" />
      <NodeTable :items="nfts" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import WalletReactiveFetch, { IReactiveFetch } from '~/mixins/wallet-reactive-fetch'

@Component
export default class Mynft extends WalletReactiveFetch implements IReactiveFetch {
  get nodeStation () {
    return [
      {
        icon: require('../assets/img/nodesIcon/totalnodes_icon.svg'),
        title: 'Pending Rewards',
        price: this.isWalletConnected ? this.$store.getters['nodes/totalPendingRewards'] : null,
        percentage: null
      },
      {
        icon: require('../assets/img/nodesIcon/mynodes_icon.svg'),
        title: 'My Nodes',
        price: this.isWalletConnected ? this.$store.getters['nodes/myTotalCreated'] : null,
        percentage: null
      },
      {
        icon: require('../assets/img/nodesIcon/polarbalance_icon.svg'),
        title: 'My $POLAR Balance',
        price: this.isWalletConnected ? this.$store.getters['tokens/balanceForToken'](this.$store.state.tokens.tokens.POLAR.address) :null,
        percentage: null
      }
    ]
  }

  get nfts () {
    return this.$store.getters['nft/myNFTsByCreationDateDesc']
  }

  get luckyBoxes () {
    return this.$store.state.luckyboxes.myLuckyBoxes ?? []
  }

  async reactiveFetch () {
    if (this.isWalletConnected) {
      await this.$store.dispatch('nodes/loadOldNodeCount')
      await {        
        lbTypes: await this.$store.dispatch('luckyboxes/loadLuckyBoxTypes'),
        myLbs: await this.$store.dispatch('luckyboxes/loadMyLuckyBoxes'),
        polarBalance: await this.$store.dispatch('tokens/loadBalance', this.$store.state.tokens.tokens.POLAR.address),
        myNFTs: await (async () => {
          await this.$store.dispatch('nodes/loadNodeTypes')
          await this.$store.dispatch('nft/loadMyNFTs')
        })()
      }
    }
  }

  created () {
    const interval = setInterval(() => {
      this.$fetch()
    }, 10000)

    this.$once('hook:beforeDestroy', () => {
      clearInterval(interval)
    })
  }
}
</script>
