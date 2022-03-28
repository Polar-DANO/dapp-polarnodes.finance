<template>
  <div class="overflow-x-auto w-full">
    <div class="flex flex-col">
      <div class="flex justify-between bg-[#00C6ED]  rounded-t-lg p-[16px] min-w-[420px]">
        <div class="text-white text-[16px]">
          My Mountain NFTs
        </div>
        <v-btn
          class="tex text-white font-normal text-[16px] border-solid border-[white] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px]"
          dark
          text
          :loading="isClaimAllBtnLoading"
          :disabled="isClaimAllBtnLoading"
          @click="onClaimAll"
        >
          Claim All
        </v-btn>
      </div>
      <table
        class="mx-auto w-[100%] min-w-[420px] rounded-b-lg bg-[#17171B]"
      >
        <thead>
          <tr>
            <th class="w-[14%] pt-[12px] pl-[16px] text-left text-[12px]">
              <span class="text-[#00c6ed]">NFT ID</span>
            </th>
            <th class="w-[14%] pt-[12px] pl-[16px] text-left text-[12px]">
              <span class="text-[#00c6ed]">NFT Tier</span>
            </th>
            <th class="w-[14%] pt-[12px] pl-[16px] text-left text-[12px]">
              <span class="text-[#00c6ed]">Date</span>
            </th>
            <th class="w-[14%] pt-[12px] pl-[16px] text-left text-[12px]">
              <span class="text-[#00c6ed]">Last Claim Date</span>
            </th>
            <th class="w-[15%] pt-[12px] pl-[16px] text-left text-[12px]">
              <span class="text-[#00c6ed]">Claimed Rewards</span>
            </th>
            <th class="w-[20%] pt-[12px] pl-[16px] text-left text-[12px]">
              <span class="text-[#00c6ed]">Pending Rewards</span>
            </th>
            <th class="w-[20%] pt-[12px] pl-[16px] text-left text-[12px]" />
          <!-- <th class="pt-[12px] pl-[16px] text-left text-[12px]">
            <button
              class="text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[1px] hover:bg-[#00C6ED] rounded-[14px] px-[30%] my-[10px]"
              @click="()=> nftSellSectionModal = true"
            >
              <div>Manage</div>
            </button>
          </th> -->
          </tr>
        </thead>
        <tbody class="divide-white/10 divide-y-[1px] px-[16px]" />
        <tr v-for="nft in items" :key="`${nft.tokenId}-${nft.nodeType}`">
          <td
            class="py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
            #{{ nft.tokenId }}
            <!-- {{ item.nodeIndex }} -->
          </td>
          <td
            class="py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
            {{ nft.nodeType }}
          </td>
          <td
            class="py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
            {{ formatDate(nft.creationTime) }}
          </td>

          <td class="py-[12px] pl-[16px] text-left text-[12px] text-white">
            {{ formatDate(nft.lastClaimTime) }}
          </td>
          <td class="py-[12px] pl-[16px] text-left text-[12px] text-white">
            -
          </td>
          <td class="flex flex-wrap items-center justify-center py-[12px] pl-[16px] text-[12px] text-white">
            {{ formatEther(nft.userPendingRewards) || '-' }} $POLAR
          </td>
          <td>
            <button
              class="text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px] my-[10px] ml-[16px]"
              @click="openSellModal(nft)"
            >
              <div>Manage</div>
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="nftSellSectionModal">
      <NFTSellSectionModal :nft="selectedNft" @closeSellModal="()=>nftSellSectionModal=false" />
    </div>
    <div v-if="nftSellModal">
      <NFTSellModal :nft="selectedNft" @closeSellModal="()=>nftSellModal=false" @sellModal="clickedSellSectionModal" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as ethers from 'ethers'
import { NFT } from '~/models/nft'

@Component({
  props: {
    items: Array as () => NFT[]
  }
})
export default class NodeTable extends Vue {
  private nftSellSectionModal = false
  private nftSellModal = false
  private selectedNft: NFT | null = null
  private isClaimAllBtnLoading = false

  formatDate (date: Date) {
    return new Intl.DateTimeFormat().format(date)
  }

  private clickedSellSectionModal () {
    this.nftSellSectionModal = true
    this.nftSellModal = false
  }

  public openSellModal (nft: NFT) {
    this.selectedNft = nft
    this.nftSellModal = true
    this.nftSellSectionModal = false
  }

  async onClaimAll () {
    try {
      this.isClaimAllBtnLoading = true
      await this.$store.dispatch('nft/claimAll')
    } finally {
      this.isClaimAllBtnLoading = false
    }
  }

  // public onError (err: { message: string } | null): void {
  //   if (err) {
  //     const inAppAlert = this.$root.$refs.alert as unknown as Record<
  //       string,
  //       Function
  //     >

  //     if (err.message.includes('User denied transaction signature')) {
  //       inAppAlert.MustSign()
  //     } else if (err.message.includes('GET REWARD OF: NO NODE OWNER')) {
  //       inAppAlert.NoOwner()
  //     } else if (err.message.includes('MANIA CSHT: Blacklisted address')) {
  //       inAppAlert.NodesBlacklist()
  //     } else if (
  //       err.message.includes('MANIA CSHT:  creation from the zero address')
  //     ) {
  //       inAppAlert.MustSign()
  //     } else if (
  //       err.message.includes(
  //         'MANIA CSHT: futur and rewardsPool cannot cashout rewards'
  //       )
  //     ) {
  //       inAppAlert.MustSign()
  //     } else if (
  //       err.message.includes(
  //         "MANIA CSHT: You don't have enough reward to cash out"
  //       )
  //     ) {
  //       inAppAlert.MustSign()
  //     } else if (err.message.includes('Nothing to claim')) {
  //       inAppAlert.NoClaim()
  //     } else {
  //       inAppAlert.OtherError()
  //     }
  //   }
  // }

  public formatEther (bn: ethers.BigNumber) {
    if (ethers.BigNumber.isBigNumber(bn)) {
      return parseFloat(ethers.utils.formatEther(bn)).toFixed(4)
    }

    return bn
  }
}
</script>
