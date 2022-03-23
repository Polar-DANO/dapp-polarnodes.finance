<template>
  <div
    class="md:flex md:flex-wrap bg-[#17171B] rounded-[12px] min-h-[172px] border-solid border-[#00C6ED] border-[1px] divide-white/40 divide-x-[1px] py-[16px] gap-2"
  >
    <div class="flex flex-col md:w-[35%]">
      <span class="text-[16px] text-white ml-[16px]">Create A Node</span>
      <div class="flex align-baseline">
        <span class="text-[16px] text-[#00C6ED] ml-[40px] mr-[16px] mt-[1px]"
          >Type:</span
        >
        <div class="w-[70%]">
          <v-select
            :items="nodeList"
            item-value="nodeValue"
            item-text="nodeName"
            placeholder="Select NodeType"
            @change="changeNodeType"
            dense
            class="w-[80%] focus:border-none focus:outline-none"
          ></v-select>
        </div>
      </div>
      <div v-if="checkLevelUp" class="flex flex-col align-baseline">
        <span class="text-[16px] text-[#00C6ED] ml-[40px] mr-[16px] mt-[1px]"
          >Select node to exchange:</span
        >
        <span class="text-[16px] text-[#FF0000] ml-[40px] mr-[16px] mt-[7px]">
          WARNING: LEVEL UP MAKES YOU LOSE PENDING REWARDS.<br />
          Attention: please count the number of nodes you want to exchange.<br />
          If you select more than the price of the target node, you will lose
          the excess nodes.<br />
          Make sure that the total amount of nodes you exchange corresponds to
          the price of the target node.<br />
          Be careful.</span
        >
        <div class="w-[70%]">
          <v-select
            :items="list"
            item-value="index"
            item-text="nodeName"
            placeholder="Select NodeType"
            attach
            chips
            class="w-[80%] ml-[40px] md:ml-[100px] focus:border-none focus:outline-none"
            @change="nodeToexchange"
            multiple
            return-object
          >
          </v-select>
        </div>
      </div>
      <div
        v-if="!checkLevelUp"
        class="flex justify-center mt-[20px] mb-[10px] mx-[114px]"
      >
        <button
          class="w-[32px] h-[22px] bg-[#00C6ED] rounded-[14px] mr-[16px] px-[12px] py-[4]"
          @click="decrement"
        >
          -
        </button>
        <div
          class="w-[64px] border-solid border-b-white/40 border-b-[1px] leading-tight text-center text-white"
        >
          {{ counter }}
        </div>
        <button
          class="w-[32px] h-[22px] bg-[#00C6ED] rounded-[14px] ml-[16px] px-[12px] py-[4]"
          @click="increment"
        >
          +
        </button>
      </div>
      <v-checkbox
        v-if="!checkLevelUp && !isMigrate"
        class="pl-[48px] md:pl-[66px] mt-[10px]"
        label="Create Node With Pending Rewards"
        color="#00C6ED"
        v-model="pendingNodeCreate"
        hide-details
      ></v-checkbox>
      <v-checkbox
        v-if="!isMigrate"
        class="pl-[48px] md:pl-[66px]"
        label="Level up nodes"
        color="#00C6ED"
        v-model="checkLevelUp"
        hide-details
      ></v-checkbox>
      <v-checkbox
        v-if="!checkLevelUp"
        class="pl-[48px] md:pl-[66px]"
        label="Migrate my old nodes"
        color="#00C6ED"
        v-model="isMigrate"
        hide-details
      ></v-checkbox>

      <!-- <div>
          <v-select
            v-model="value"
            :items="name"
            attach
            chips
            class="w-[80%] focus:border-none focus:outline-none"
            multiple
          ></v-select>
    </div> -->
      <div class="flex justify-center px-[66px]">
        <button
          class="rounded-[14px] h-[33px] px-[42px] md:px-[30%] mt-[16px] border-solid border-[#00C6ED] border-[1px] hover:bg-[#00C6ED]"
        >
          <button
            v-if="checkLevelUp && !isMigrate"
            class="text-center text-white !px-[0px]"
            @click="levelUpNodeClick"
          >
            Level UP
          </button>
          <div v-if="!checkLevelUp && !isMigrate">
            <button
              v-if="!approved"
              class="text-center text-white"
              @click="nodeApprove"
            >
              <div>Approve</div>
            </button>
            <button
              v-if="approved"
              class="text-center text-white"
              @click="nodeCreate"
            >
              <div>Create</div>
            </button>
          </div>
          <button
            v-if="isMigrate"
            class="text-center text-white !px-[0px]"
            @click="migrateOldNodes"
          >
            Migrate
          </button>
        </button>
      </div>
    </div>
    <div class="flex flex-col px-[16px] mt-[20px] md:mt-[0px] m:w-[65%]">
      <span class="text-[16px] text-white">Tokenomic Details</span>
      <div
        class="md:flex md:first-letter:mt-[10px] divide-white/40 md:divide-x-[1px] py-[16px]"
      >
        <div class="md:mt-34px pr-[10px]">
          <div class="flex md:mt-[10px] md:pt-[10px]">
            <span class="text-[#00C6ED] text-[12px]">Cost</span>
            <span class="text-[#00C6ED] text-[12px] mx-[4px]">=</span>
            <span class="text-[12px] text-white"
              >{{ polarPerNode }} $POLAR / Node</span
            >
          </div>
          <div class="flex mt-[3px]">
            <span class="text-[#00C6ED] text-[12px]">Yield</span>
            <span class="text-[#00C6ED] text-[12px] mx-[4px]">=</span>
            <span class="text-[12px] text-white"
              >{{ polarPerDay }} $POLAR / Claim (4h)</span
            >
          </div>
          <div class="flex mt-[3px]">
            <span class="text-[#00C6ED] text-[12px]">Max slots</span>
            <span class="text-[#00C6ED] text-[12px] mx-[4px]">=</span>
            <span class="text-[12px] text-white"
              >{{ polarNodeCount }} / {{ polarNodeMax }}</span
            >
          </div>

          <div class="flex mt-[10px]">
            <span class="text-[#00C6ED] text-[12px]">Claim Before ROI</span>
            <span class="text-[#00C6ED] text-[12px] mx-[4px]">=</span>
            <span class="text-[12px] text-white"
              >{{ claimTaxBeforeTime }}% tax</span
            >
          </div>

          <div class="flex mt-[10px]">
            <span class="text-[#00C6ED] text-[12px]">Max LevelUp Global</span>
            <span class="text-[#00C6ED] text-[12px] mx-[4px]">=</span>
            <span class="text-[12px] text-white"
              >{{ maxLevelUpGlobal }} nodes</span
            >
          </div>
          <div class="flex mt-[3px]">
            <span class="text-[#00C6ED] text-[12px]">Max LevelUp User</span>
            <span class="text-[#00C6ED] text-[12px] mx-[4px]">=</span>
            <span class="text-[12px] text-white"
              >{{ maxLevelUpUser }} nodes</span
            >
          </div>

          <div class="flex mt-[10px]">
            <span class="text-[#00C6ED] text-[12px]"
              >Max Creation Pending Global</span
            >
            <span class="text-[#00C6ED] text-[12px] mx-[4px]">=</span>
            <span class="text-[12px] text-white"
              >{{ maxCreationPendingGlobal }} nodes</span
            >
          </div>
          <div class="flex mt-[3px]">
            <span class="text-[#00C6ED] text-[12px]"
              >Max Creation Pending User</span
            >
            <span class="text-[#00C6ED] text-[12px] mx-[4px]">=</span>
            <span class="text-[12px] text-white"
              >{{ maxCreationPendingUser }} nodes</span
            >
          </div>
        </div>
        <div class="flex flex-col md:pl-[10px]">
          <span class="text-[#00C6ED] text-[12px] mt-[16px]"
            >Distribution:</span
          >
          <div class="flex ml-[17px] mt-[8px]">
            <span class="text-[12px] text-white mr-[6px]">→</span>
            <span class="text-[#00c6ed] text-[12px]">Rewards Pool = </span>
            <span class="text-[12px] text-white !ml-[4px]">
              {{ rewardsPool }}%</span
            >
          </div>
          <div class="flex ml-[17px]">
            <span class="text-[12px] text-white mr-[6px]">→</span>
            <span class="text-[#00c6ed] text-[12px]">Treasury Fund = </span>
            <span class="text-[12px] text-white !ml-[4px]">
              {{ treasuryFund }}%</span
            >
          </div>
          <div class="flex ml-[17px]">
            <div class="text-[12px] text-white mr-[6px]">→</div>
            <span class="text-[#00c6ed] text-[12px]">Liquidity Pool = </span>
            <span class="text-[12px] text-white !ml-[4px]">
              {{ liquidityPool }}%</span
            >
          </div>

          <div class="flex ml-[17px]">
            <span class="text-[12px] text-white mr-[6px]">→</span>
            <span class="text-[#00c6ed] text-[12px]">Polar Team = </span>
            <span class="text-[12px] text-white !ml-[4px]">
              {{ polarTeam }}%</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Default from "~/layouts/default.vue"
import { abi as NODER } from "~/hardhat/artifacts/contracts/Handler.sol/Handler.json";
import { abi as POLAR } from "~/hardhat/artifacts/contracts/PolarNode.sol/PolarNode.json";

import { WalletModule } from "~/store";

declare var window: any;

const { Token, PolarToken, Owner } = require("~/hardhat/scripts/address.js");

const ethers = require("ethers");

@Component({
  props: {
    nodeList: Array,
    list: Array,
  },
})
export default class CreateNode extends Vue {
  public provider: any;
  public signer: any;
  public pnode: any;
  public polar: any;

  private counter = 1;
  private nodeName = [];
  private seletedNodeName = "";
  private pendingNodeCreate = false;
  private approved = false;
  private checkLevelUp = false;
  private polarPerNode = 0;
  private polarPerDay = 0;
  private exchangeNodes: any = [];
  private rewardsPool = 0;
  private treasuryFund = 0;
  private liquidityPool = 0;
  private polarTeam = 0;
  private myNodes: any = [];
  private isMigrate = false;
  private claimTaxBeforeTime = 0;
  private maxLevelUpNodes = 0;
  private maxLevelUpGlobal = 0;
  private maxLevelUpUser = 0;
  private maxCreationPendingGlobal = 0;
  private maxCreationPendingUser = 0;
  private polarNodeCount = 0;
  private polarNodeMax = 0;

  private increment() {
    this.counter++;
  }

  private decrement() {
    if (this.counter > 1) this.counter--;
    else this.counter == 1;
  }

  private async levelUpNodeClick(): Promise<void> {
    try {
      await this.pnode.levelUp(this.exchangeNodes, this.seletedNodeName);
    } catch (err: any) {
      if (err.data) {
        if (
          err.data.message.indexOf("No one can level up this type of node") >= 0
        ) {
          (this.$root.$refs.alert as Default).NoOneLevelUp();
          return;
        }
        if (err.data.message.indexOf("Level up limit reached for user") >= 0) {
          (this.$root.$refs.alert as Default).MaxLimitLevelUp();
          return;
        }
        if (err.data.message.indexOf("target doesnt exist") >= 0) {
          (this.$root.$refs.alert as Default).NoTarget();
          return;
        }
        if (err.data.message.indexOf("name doesnt exist") >= 0) {
          (this.$root.$refs.alert as Default).NoName();
          return;
        }
        if (err.data.message.indexOf("Not owned") >= 0) {
          (this.$root.$refs.alert as Default).NoOwner();
          return;
        }
        if (err.data.message.indexOf("Cannot level down") >= 0) {
          (this.$root.$refs.alert as Default).NoLevelDown();
          return;
        }
        if (err.data.message.indexOf("Not enough sent") >= 0) {
          (this.$root.$refs.alert as Default).NoEnoughSent();
          return;
        }
        if (err.data.message.indexOf("Node level up not authorized yet") >= 0) {
          (this.$root.$refs.alert as Default).NotAuthorized();
          return;
        }
        if (err.data.message.indexOf("Max already reached") >= 0) {
          (this.$root.$refs.alert as Default).MaxAlreadyReached();
          return;
        }
      } else {
        console.log(err);
      }
    }
  }
  /*
  private changeNodeCreateType() {
    this.pendingNodeCreate = !this.pendingNodeCreate
  }

  private levelUpNodeCheck() {
    this.checkLevelUp = !this.checkLevelUp
    console.log(this.checkLevelUp,"ssssss")
  }

  private enableMigrateNodes() {
    this.isMigrate = !this.isMigrate
  }
*/
  private async migrateOldNodes(): Promise<void> {
    try {
      if (WalletModule.walletaddress) {
        let result = await this.pnode.migrateNodes(
          WalletModule.walletaddress,
          this.counter
        );
      }
    } catch (err: any) {
      if (err.data) {
        if (err.data.message.indexOf("Too many nodes requested") >= 0) {
          (this.$root.$refs.alert as Default).TooManyRequest();
          return;
        }
      }
    }
  }

  private nodeToexchange(val: any) {
    let nodeList = val;
    this.exchangeNodes = [];
    for (let i = 0; i < nodeList.length; i++)
      this.exchangeNodes.push(nodeList[i].nodeName);
  }

  private async nodeApprove(): Promise<void> {
    if (!this.approved) {
      let result = await this.polar
        .approve(
          Token,
          ethers.BigNumber.from(
            "115792089237316195423570985008687907853269984665640564039457584007913129639935"
          )
        )
        .then((res: any) => {
          this.approved = true;
        });
    }
  }

  private async nodeCreate(): Promise<void> {
    try {
      if (this.seletedNodeName == null && this.approved) {
        (this.$root.$refs.alert as Default).NodesName();
        return;
      } else {
        if (this.pendingNodeCreate) {
          await this.pnode
            .createNodeWithPending(this.seletedNodeName, this.counter)
            .then((res: any) => {});
        } else {
          await this.pnode
            .createNodeWithTokens(this.seletedNodeName, this.counter)
            .then((res: any) => {});
        }
      }
    } catch (err: any) {
      if (err.data) {
        if (
          err.data.message.indexOf("User denied transaction signature") >= 0
        ) {
          (this.$root.$refs.alert as Default).MustSign();
          return;
        }
        if (err.data.message.indexOf("Global limit reached") >= 0) {
          (this.$root.$refs.alert as Default).MaxReached();
          return;
        }
        if (
          err.data.message.indexOf(
            "Creation with pending limit reached for user"
          ) >= 0
        ) {
          (this.$root.$refs.alert as Default).UserMaxReached();
          return;
        }
        if (err.data.message.indexOf("Balance too low for creation") >= 0) {
          (this.$root.$refs.alert as Default).NeedBalance();
          return;
        }
        if (err.data.message.indexOf("nodeTypeName does not exist") >= 0) {
          (this.$root.$refs.alert as Default).NodesName();
          return;
        }
        if (err.data.message.indexOf("Blacklisted address") >= 0) {
          (this.$root.$refs.alert as Default).NodesBlacklist();
          return;
        }
        if (err.data.message.indexOf("fInsufficient Pending") >= 0) {
          (this.$root.$refs.alert as Default).noLiquidity();
          return;
        }
        if (err.data.message.indexOf("Balance too low for creation.") >= 0) {
          (this.$root.$refs.alert as Default).NeedBalance();
          return;
        }
        if (err.data.message.indexOf("Node creation not authorized yet") >= 0) {
          (this.$root.$refs.alert as Default).NotAuthorized();
          return;
        }
        if (
          err.data.message.indexOf(
            "futur and rewardsPool cannot create node"
          ) >= 0
        ) {
          (this.$root.$refs.alert as Default).NotFutur();
          return;
        }
        if (err.data.message.indexOf("Max already reached") >= 0) {
          (this.$root.$refs.alert as Default).MaxReached();
          return;
        }
      } else {
        if (
          err.message.indexOf(
            "MetaMask Tx Signature: User denied transaction signature."
          ) >= 0
        ) {
          (this.$root.$refs.alert as Default).UserReject();
          return;
        }
      }

      return;
    }
  }

  private async changeNodeType(val: any): Promise<void> {
    this.seletedNodeName = val;
    try {
      let nodeData = await this.pnode.getNodeTypeAll(val);
      console.log(nodeData);
      this.polarPerNode = ethers.utils.formatEther(nodeData[0]._hex);
      this.polarPerDay = ethers.utils.formatEther(nodeData[2]._hex);
      this.claimTaxBeforeTime = parseInt(nodeData[6]._hex, 16);
      this.maxLevelUpGlobal = parseInt(nodeData[7]._hex, 16);
      this.maxLevelUpUser = parseInt(nodeData[8]._hex, 16);
      this.maxCreationPendingGlobal = parseInt(nodeData[9]._hex, 16);
      this.maxCreationPendingUser = parseInt(nodeData[10]._hex, 16);
      this.polarNodeCount = parseInt(nodeData[4]._hex, 16);
      this.polarNodeMax = parseInt(nodeData[5]._hex, 16);
    } catch (err) {
      console.log(err);
    }
  }

  private async created() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    if (this.provider) {
      try {
        this.signer = this.provider.getSigner();
        this.pnode = new ethers.Contract(Token, NODER, this.signer);
        this.polar = new ethers.Contract(PolarToken, POLAR, this.signer);
        console.log(this.pnode);
        console.log(this.polar);

        this.myNodes = this.$props.myNode;
        let tmp = await this.pnode.rewardsFee();
        this.rewardsPool = parseInt(tmp._hex, 16);

        tmp = await this.pnode.futurFee();
        this.treasuryFund = parseInt(tmp._hex, 16);

        tmp = await this.pnode.liquidityPoolFee();
        this.liquidityPool = parseInt(tmp._hex, 16);

        this.polarTeam =
          100 - (this.rewardsPool + this.treasuryFund + this.liquidityPool);

        if (this.provider && WalletModule.walletaddress) {
          let tmp = await this.polar
            .allowance(WalletModule.walletaddress, Token)
            .then((res: any) => {
              if (res > 0) {
                this.approved = true;
              }
            });
        } else {
          (this.$root.$refs.alert as Default).NoProvider();
        }
      } catch (err) {
        (this.$root.$refs.alert as Default).AcceptMetamask();
      }
    } else {
      (this.$root.$refs.alert as Default).NoProvider();
    }
  }
}
</script>
