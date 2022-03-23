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
        v-for="({ index, name, cost }, i) of luckyBoxesList"
        :key="`${name}-${i}`"
        :index="index"
        :name="name"
        :cost="cost"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as ethers from 'ethers'
import AlertComponents from '~/components/AlertComponents.vue'

import { abi as HANDLER_ABI } from '~/hardhat/artifacts/contracts/Handler.sol/Handler.json'
import { abi as POLAR_TOKEN_ABI } from '~/hardhat/artifacts/contracts/Polar.sol/Polar.json'
import Default from '~/layouts/default.vue'
import { WalletModule } from '~/store'
import { luckyBoxes } from '~/models/constants'

import { Token as PolarToken, Handler } from '~/hardhat/scripts/address'

declare let window: any

@Component({
  components: { AlertComponents }
})
export default class Nodes extends Vue {
  public nodeStation = [
    {
      icon: require('../assets/img/nodesIcon/totalnodes_icon.svg'),
      title: 'Total Nodes',
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

  public luckyBoxesList = luckyBoxes

  private nodeNames: any = []

  private created () {
    this.listenConnectEvent()
    this.intervalFetchData()
  }

  private intervalFetchDataInterval?: ReturnType<typeof setInterval>

  public intervalFetchData () {
    this.intervalFetchDataInterval = setInterval(() => {
      this.listenConnectEvent()
    }, 15000)
  }

  public beforeDestroy () {
    if (this.intervalFetchDataInterval) { clearInterval(this.intervalFetchDataInterval) }
  }

  private async listenConnectEvent () {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      )
      try {
        const signer = provider.getSigner()

        const handlerContract = new ethers.Contract(Handler, HANDLER_ABI, signer)
        const polar = new ethers.Contract(PolarToken, POLAR_TOKEN_ABI, signer)

        const totalNodes = await handlerContract.getTotalCreatedNodes()
        this.nodeStation[0].price = totalNodes.toString()
        this.nodeStation[1].price = (WalletModule.walletaddress)
          ? (await handlerContract.getTotalNodesOf(WalletModule.walletaddress)).toString()
          : '-'
        this.nodeStation[2].price = (WalletModule.walletaddress)
          ? ethers.utils.formatEther(await polar.balanceOf(WalletModule.walletaddress))
          : '-'

        const nodeSize = (await handlerContract.getNodeTypesSize()).toNumber()
        this.nodeNames = await handlerContract.getNodeTypesBetweenIndexes(0, nodeSize)
      } catch (err) {
        console.error(err);
        (this.$root.$refs.alert as Default).AcceptMetamask()
      }
    }
  }
}
</script>
