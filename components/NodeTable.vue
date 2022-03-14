<template>
  <div class="overflow-x-auto w-full">
    <table
      class="mx-auto w-full whitespace-nowrap rounded-lg bg-[#17171B] overflow-hidden"
    >
      <thead>
        <tr class="text-white text-left bg-[#00C6ED]">
          <th class="p-[16px]">My Nodes</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th class="pl-[16px] pt-[12px] text-left">
            <button
              class="text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[1px] hover:bg-[#00C6ED] rounded-[14px] px-[30%] my-[10px]"
              @click="rewardClaim"
            >
              <div>Claim Rewards</div>
            </button>
          </th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th class="w-[20%] pt-[12px] pl-[16px] text-left text-[12px]">
            <span class="text-[#00c6ed]">Node Level</span>
          </th>
          <th class="w-[30%] pt-[12px] pl-[16px] text-left text-[12px]">
            <span class="text-[#00c6ed]">Node Type</span>
          </th>
          <th class="w-[20%] pt-[12px] pl-[16px] text-left text-[12px]">
            <span class="text-[#00c6ed]">Node Counter</span>
          </th>
          <th class="pt-[12px] pl-[16px] text-left text-[12px]">
            <!-- <span class="text-[#00c6ed]">Last Claim</span> -->
          </th>
          <th class="pt-[12px] pl-[16px] text-left text-[12px]">
            <!-- <span class="text-[#00c6ed]">Claimed Rewards</span> -->
          </th>
          <th class="pt-[12px] pl-[16px] text-left text-[12px]">
            <!-- <span class="text-[#00c6ed]">Pending Rewards</span> -->
          </th>
        </tr>
      </thead>
      <tbody class="divide-white/10 divide-y-[1px] px-[16px]">
        <tr v-for="(item, i) in nodeData">
          <td
            class="w-[20%] py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
            {{ item.nodeIndex }}
          </td>
          <td
            class="w-[30%] py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
            {{ item.nodeType }}
          </td>
          <td
            class="w-[20%] py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
            {{ item.nodeCounter }}
          </td>

          <td class="py-[12px] pl-[16px] text-left text-[12px] text-white">
            <!-- {{item.lastClaim}} -->
          </td>
          <td class="py-[12px] pl-[16px] text-left text-[12px] text-white">
            <!-- {{item.claimRewards}} -->
          </td>
          <td class="py-[12px] pl-[16px] text-left text-[12px] text-white">
            <!-- {{item.pendingRewards}} -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

import { abi as NODER } from "~/hardhat/artifacts/contracts/NODERewardManager.sol/NODERewardManager.json";
import Defalut from "~/layouts/default.vue";

const { Token } = require("~/hardhat/scripts/address.js");

declare var window: any;

@Component({
  props: {
    items: Array,
  },
})
export default class NodeTable extends Vue {
  private nodeData = [];

  private created() {
    this.nodeData = this.$props.items;
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
