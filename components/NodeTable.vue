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
          @click="onClaimSelected"
        >
          Claim Selected NFTs
        </v-btn>
      </div>
      <table
        class="mx-auto w-[100%] min-w-[420px] rounded-b-lg bg-[#17171B]"
      >
        <thead>
          <tr>
            <th class="w-[5%] pt-[12px] pl-[16px] text-left text-[12px]">
              <v-checkbox
              class="mt-5"              
              color="#00C6ED"
              @change="onSelectAllNFT"
              />
            </th>
            <th class="w-[10%] pt-[6px] pl-[12px] text-left text-[12px]">
              <span class="text-[#00c6ed]">NFT ID</span>
            </th>
            <th class="w-[10%] pt-[6px] pl-[12px] text-left text-[12px]">
              <span class="text-[#00c6ed]">NFT Tier</span>
            </th>
            <th class="w-[14%] pt-[6px] pl-[12px] text-left text-[12px]">
              <span class="text-[#00c6ed]">Date</span>
            </th>
            <th class="w-[14%] pt-[6px] pl-[12px] text-left text-[12px]">
              <span class="text-[#00c6ed]">Last Claim Date</span>
            </th>
            <th class="w-[15%] pt-[6px] pl-[12px] text-left text-[12px]">
              <span class="text-[#00c6ed]">ROI Date</span>
            </th>
            <th class="w-[20%] pt-[6px] pl-[12px] text-left text-[12px]">
              <span class="text-[#00c6ed]">Pending Rewards</span>
            </th>
            <th class="w-[20%] pt-[6px] pl-[12px] text-left text-[12px]" />
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
        <tbody class="divide-white/10 divide-y-[1px] px-[16px]">
          <tr v-if="items.length === 0">
            <td colspan="42424242">
              <v-alert
                v-if="items.length === 0"
                type="info"
                class="mt-[30px] mx-4"
                :value="true"
                outlined
                dark
              >
                You don't have any nodes yet.
              </v-alert>
            </td>
          </tr>
          <tr v-for="nft in items" :key="`${nft.tokenId}-${nft.nodeType}`" class="align-middle">
            <td
              class="py-[6px] pl-[12px] text-left text-[12px] text-white"
            >
              <v-checkbox
              class="mt-5"
              v-model="selectedNFTs"
              :value="nft.tokenId.toNumber()"
              color="#00C6ED"              
            />
            </td>
            <td
              class="py-[6px] pl-[12px] text-left text-[12px] text-white"
            >
              #{{ nft.tokenId }}
            </td>
            <td
              class="py-[6px] pl-[12px] text-left text-[12px] text-white"
            >
              {{ nft.nodeType }} {{ nft.attribute }}
            </td>
            <td
              class="py-[6px] pl-[12px] text-left text-[12px] text-white"
            >
              {{ formatDate(nft.creationTime) }}
            </td>

            <td class="py-[6px] pl-[12px] text-left text-[12px] text-white">
              {{ formatDate(nft.lastClaimTime) }}
            </td>
            <td class="py-[6px] pl-[12px] text-left text-[12px] text-white">
              {{ formatDate(nft.timeRoi) }}
            </td>
            <td class="text-left py-[6px] pl-[12px] text-[12px] text-white">
              {{ formatEther(nft.userPendingRewards) || '-' }} $POLAR
            </td>
            <td class="pr-4">
              <button
                class="text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px] my-[10px] ml-[16px]"
                @click="openSellModal(nft)"
              >
                <div>Manage</div>
              </button>
            </td>
          </tr>
        </tbody>
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
import { Component, Vue } from 'nuxt-property-decorator';
import * as ethers from 'ethers';
import { NFT } from '~/models/nft';

@Component({
  props: {
    items: Array as () => NFT[] | null,
  },
})
export default class NodeTable extends Vue {
  private nftSellSectionModal = false;
  private nftSellModal = false;
  private selectedNft: NFT | null = null;
  private isClaimAllBtnLoading = false;
  public selectedNFTs : any = []

  formatDate (date: Date) {
    return new Intl.DateTimeFormat('default', { dateStyle: 'medium' }).format(date);
  }

  private clickedSellSectionModal () {
    this.nftSellSectionModal = true;
    this.nftSellModal = false;
  }

  async openSellModal (nft: NFT) {
    this.selectedNft = nft;
    
    await this.$store.dispatch('nft/loadSpecialROI', nft.tokenId).then(res => {
      this.nftSellModal = true;
      this.nftSellSectionModal = false;
    })    
  }

  async onClaimAll () {
    try {
      this.isClaimAllBtnLoading = true;
      await this.$store.dispatch('nft/claimAll');
    } finally {
      this.isClaimAllBtnLoading = false;
    }
  }

  async onClaimSelected() {
    try {
      this.isClaimAllBtnLoading = true
      let selNFTs = []

      for(let i = 0 ; i < this.$props.items.length ; i++) {
        if(this.selectedNFTs.includes(this.$props.items[i].tokenId.toNumber())){
          selNFTs.push(this.$props.items[i] as never)
        }
      }
      await this.$store.dispatch('nft/claimRewards',selNFTs)
    } finally {
      this.isClaimAllBtnLoading = false
    }
  }

  onSelectAllNFT (value : any) {
    if(value) {
      this.selectedNFTs = []
      this.$props.items.map((item:NFT,id:any) => this.selectedNFTs.push(item.tokenId.toNumber()));      
    } else {
      this.selectedNFTs = []      
    }
  }

  public formatEther (bn: ethers.BigNumber) {
    if (ethers.BigNumber.isBigNumber(bn)) {
      return parseFloat(ethers.utils.formatEther(bn)).toFixed(4);
    }

    return bn;
  }
}
</script>
