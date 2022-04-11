<template>
  <div class="flex flex-col mx-[10%] md:mx-[64px] mt-[30px] md:mt-[123px]">
    <span class="text-[24px] text-[#FFFFFF] ml-[3px]">Protocol Stats ❄️</span>
    <div class="md:flex flex-wrap gap-[24px] mt-[32px]">
      <DataTable
        v-for="(item, i) in protocolStats"
        :key="i"
        :title="item.title"
        :icon="item.icon"
        :price="item.price"
        :percentage="item.percentage"
      />
    </div>
    <span class="text-[24px] text-[#FFFFFF] ml-[3px] mt-[30px] md:mt-[118px]">Personal Stats 🗻️</span>
    <div class="md:flex flex-wrap gap-[24px] mt-[32px]">
      <DataTable
        v-for="(item, i) in personalStats"
        :key="i"
        :title="item.title"
        :icon="item.icon"
        :price="item.price"
        :percentage="item.percentage"
      />
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import WalletReactiveFetch, { IReactiveFetch } from '~/mixins/wallet-reactive-fetch';
import addresses from '~/config/addresses'
@Component({
  layout: 'page',
})
export default class IndexVue extends WalletReactiveFetch implements IReactiveFetch {
  get protocolStats () {
    return [
      {
        icon: require('../assets/img/dashboardIcon/price_icon.svg'),
        title: '$POLAR Price',
        price: this.$store.state.coingecko.price,
        percentage: this.$store.state.coingecko.percentage24h,
      },
      {
        icon: require('../assets/img/dashboardIcon/marketcap_icon.svg'),
        title: 'Market Cap',
        price: this.$store.state.coingecko.marketCap,
        percentage: null,
      },
      {
        icon: require('../assets/img/dashboardIcon/circsupply_icon.svg'),
        title: 'Total Supply',
        price: this.$store.state.coingecko.totalSupply,
        percentage: null,
      },
      {
        icon: require('../assets/img/dashboardIcon/totalnode_icon.svg'),
        title: 'Total Nodes',
        price: this.$store.getters['nodes/totalCreated'],
        percentage: null,
      },
    ];
  }

  get personalStats () {
    return [
      {
        icon: require('../assets/img/dashboardIcon/mynode_icon.svg'),
        title: 'My Nodes',
        price: this.isWalletConnected ? this.$store.getters['nodes/myTotalCreated'] : null,
        percentage: null,
      },
      {
        icon: require('../assets/img/dashboardIcon/polarbalance_icon.svg'),
        title: 'My $POLAR Balance',
        price: this.isWalletConnected ? this.$store.getters['tokens/balanceForToken'](addresses.Token) : null,
        percentage: null,
      },
      {
        icon: require('../assets/img/dashboardIcon/dailyrewards_icon.svg'),
        title: 'Daily Rewards',
        price: this.isWalletConnected ? this.$store.getters['nodes/totalDailyRewards'] : null,
        percentage: null,
      },
      {
        icon: require('../assets/img/dashboardIcon/pendingrewards_icon.svg'),
        title: 'Pending Rewards',
        price: this.isWalletConnected ? this.$store.getters['nodes/totalPendingRewards'] : null,
        percentage: null,
      },
    ];
  }

  async reactiveFetch () {
    await Promise.all([
      this.$store.dispatch('coingecko/loadCoinData'),
      this.$store.dispatch('nodes/loadNodeTypes'),
      ...(
        (this.isWalletConnected)
          ? [
              this.$store.dispatch('tokens/loadBalance', addresses.Token),
            ]
          : []),
    ]);
  }
}
</script>
