<template>
  <div class="overflow-x-auto w-full">
    <div class="flex flex-col">
      <div class="flex justify-between bg-[#00C6ED]  rounded-t-lg p-[16px] min-w-[420px]">
        <div class="text-white text-[16px]">
           My Mountain NFTs
        </div>
        <button
          class="tex text-white font-normal text-[16px] border-solid border-[white] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px]"
          @click="rewardClaim"
        >
          <div>Claim All</div>
        </button>
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
            <span class="text-[#00c6ed]">last Claim</span>
          </th>
          <th class="w-[15%] pt-[12px] pl-[16px] text-left text-[12px]">
            <span class="text-[#00c6ed]">Claimed Rewards</span>
          </th>
          <th class="w-[20%] pt-[12px] pl-[16px] text-left text-[12px]">
            <span class="text-[#00c6ed]">Pending Rewards</span>
          </th>
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
      </tbody>
        <tr>
          <td
            class="py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
          001
            <!-- {{ item.nodeIndex }} -->
          </td>
          <td
            class="py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
          Snow Node
            <!-- {{ item.nodeType }} -->
          </td>
          <td
            class="py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
          12/01/2022
            <!-- {{ item.nodeCounter }} -->
          </td>

          <td class="py-[12px] pl-[16px] text-left text-[12px] text-white">
          $640
            <!-- {{item.lastClaim}} -->
          </td>
          <td class="py-[12px] pl-[16px] text-left text-[12px] text-white">
          $640
            <!-- {{item.claimRewards}} -->
          </td>
          <td class="flex flex-wrap items-center justify-center py-[12px] pl-[16px] text-[12px] text-white">
          $640
            <button
              class="text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px] my-[10px] ml-[16px]"
              @click="()=> nftSellModal = true"
            >
              <div>Manage</div>
            </button>
          </th>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="nftSellSectionModal">
      <NFTSellSectionModal @closeModal="()=>nftSellSectionModal=false"/>
    </div>
    <div v-if="nftSellModal">
      <NFTSellModal @closeSellModal="()=>nftSellModal=false" @sellModal="clickedSellSectionModal" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

import { abi as NODER } from "~/hardhat/artifacts/contracts/NODERewardManager.sol/NODERewardManager.json";
import Default from "~/layouts/default.vue";

const { Token } = require("~/hardhat/scripts/address.js");

declare var window: any;

@Component({
  props: {
    items: Array,
  },
})
export default class NodeTable extends Vue {
  private nodeData = [];
  private nftSellSectionModal = false;
  private nftSellModal = false;

  private created() {
    this.nodeData = this.$props.items;
  }

  private clickedSellSectionModal() {
    this.nftSellSectionModal = true;
    this.nftSellModal = false;
  }
  public onError(err: { message: string } | null): void {
    if (err) {
      const inAppAlert = this.$root.$refs.alert as unknown as Record<
        string,
        Function
      >;

      if (err.message.includes("User denied transaction signature")) {
        inAppAlert.MustSign();
      } else if (err.message.includes("GET REWARD OF: NO NODE OWNER")) {
        inAppAlert.NoOwner();
      } else if (err.message.includes("MANIA CSHT: Blacklisted address")) {
        inAppAlert.NodesBlacklist();
      } else if (
        err.message.includes("MANIA CSHT:  creation from the zero address")
      ) {
        inAppAlert.MustSign();
      } else if (
        err.message.includes(
          "MANIA CSHT: futur and rewardsPool cannot cashout rewards"
        )
      ) {
        inAppAlert.MustSign();
      } else if (
        err.message.includes(
          "MANIA CSHT: You don't have enough reward to cash out"
        )
      ) {
        inAppAlert.MustSign();
      } else if (err.message.includes("Nothing to claim")) {
        inAppAlert.NoClaim();
      } else {
        inAppAlert.OtherError();
      }
    }

    return;
  }

  private async rewardClaim(): Promise<void> {
    const ethers = require("ethers");
    if (window.ethereum) {
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const pnode = new ethers.Contract(Token, NODER, signer);

      try {
        await pnode.cashoutAll();
      } catch (err: any) {
        this.onError(err);
      }
    }
  }
}
</script>
