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
        :percentage="item.percentage"/>
    </div>
    <span class="text-[24px] text-[#FFFFFF] ml-[3px] mt-[30px] md:mt-[118px]">Personal Stats 🗻️</span>
    <div class="md:flex flex-wrap gap-[24px] mt-[32px]">
      <DataTable
      v-for="(item, i) in personalStats"
        :key="i"
        :title="item.title"
        :icon="item.icon"
        :price="item.price"
        :percentage="item.percentage"/>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import axios from "axios"

import { abi as HANDLER_ABI } from "~/hardhat/artifacts/contracts/Handler.sol/Handler.json";
import { abi as POLAR_TOKEN_ABI } from "~/hardhat/artifacts/contracts/Polar.sol/Polar.json";
import { abi as NODE_TYPE_ABI } from "~/hardhat/artifacts/contracts/NodeType.sol/NodeType.json";
import { PAYOUTS_PER_DAY } from '~/models/constants';

import {WalletModule} from '~/store'


const {
  Token: PolarTokenAddr,
  Handler: HandlerAddr
} = require("~/hardhat/scripts/address.js");

declare var window: any

@Component({  
  layout : 'page'
})
export default class IndexVue extends Vue {
  public protocolStats = [
    {
      icon: require('../assets/img/dashboardIcon/price_icon.svg'),
      title: "$POLAR Price",
      price: "0",
      percentage: "12"
    },
    {
      icon: require('../assets/img/dashboardIcon/marketcap_icon.svg'),
      title: "Market Cap",
      price: "0",
      percentage: "0"
    },
    {
      icon: require('../assets/img/dashboardIcon/circsupply_icon.svg'),
      title: "Total Supply",
      price: "1000000",
      percentage: "0"
    },
    {
      icon: require('../assets/img/dashboardIcon/totalnode_icon.svg'),
      title: "Total Nodes",
      price: "0",
      percentage: "0"
    },
  ]

   public personalStats = [
    {
      icon: require('../assets/img/dashboardIcon/mynode_icon.svg'),
      title: "My Nodes",
      price: "0",
      percentage: "0"
    },
    {
      icon: require('../assets/img/dashboardIcon/polarbalance_icon.svg'),
      title: "My $POLAR Balance",
      price: "0",
      percentage: "0"
    },
    {
      icon: require('../assets/img/dashboardIcon/dailyrewards_icon.svg'),
      title: "Daily Rewards",
      price: "0",
      percentage: "0"
    },
    {
      icon: require('../assets/img/dashboardIcon/pendingrewards_icon.svg'),
      title: "Pending Rewards",
      price: "0",
      percentage: "0"
    },
  ]  


  private getFormattedNb(nb : any) : string {
    nb = nb.toLocaleString();
    if (nb.indexOf(".") == -1) return nb;
    else {
      if (nb.indexOf(".") == nb.length - 2)
        return nb.substr(0, nb.indexOf(".") + 2) + "0";
    }
    return nb.substr(0, nb.indexOf(".") + 3);
  }

  public ProtocolData() : void {
    const params = {
      contract_addresses: "0x6c1c0319d8ddcb0ffe1a68c5b3829fd361587db4",
      vs_currencies : "usd",
      include_market_cap :true,
      include_24hr_vol : true,
      include_24hr_change : true,
      include_last_updated_at : true
    }
    try {
      axios
      .get(
        "https://api.coingecko.com/api/v3/simple/token_price/avalanche", {params : params, headers: {'Access-Control-Allow-Origin' : '*'}}
      )
      .then(
        (response : any) => {
            const keyArray = Object.keys(response.data)  
                      
            this.protocolStats[0].price = this.getFormattedNb(response.data[keyArray[0]].usd)
            this.protocolStats[0].percentage = this.getFormattedNb (response.data[keyArray[0]].usd_24h_change) 
            this.protocolStats[1].price = this.getFormattedNb(response.data[keyArray[0]].usd  * 1000000)
        }
      );
    } catch {
      console.error('Catch Network')
    }    
  }

  private get loadWalletAddress (): string {
    return WalletModule.walletaddress
  }

  private async personalData() : Promise<void> {
    if (window.ethereum) {
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(
         window.ethereum,
         "any"
      );

      const signer = provider.getSigner();

      const handlerContract = new ethers.Contract(HandlerAddr, HANDLER_ABI, signer);
      const polarTokenContract = new ethers.Contract(PolarTokenAddr, POLAR_TOKEN_ABI, signer);
      
      const totalCreatedNodes = await handlerContract.getTotalCreatedNodes();
      this.protocolStats[3].price = totalCreatedNodes.toString();

      if(WalletModule.walletaddress)
      {
        const totalNodes = await handlerContract.getTotalNodesOf(WalletModule.walletaddress);
        this.personalStats[0].price = totalNodes.toString();

        const polarBalance = await polarTokenContract.balanceOf(WalletModule.walletaddress);
        this.personalStats[1].price =this.getFormattedNb(ethers.utils.formatEther(polarBalance));
      }       

      //dailyrewards
      const nodeSize = (await handlerContract.getNodeTypesSize()).toNumber();
      let tempCounter :any= []
      let nodeCounter : any = []
      let tempNodeReward :any = []
      let perNodeReward : any = []

      const nodeName: string[] = await handlerContract.getNodeTypesBetweenIndexes(0, nodeSize);
      const nodes = await Promise.all(
        nodeName.map(async (name, index) => {
          const nodeTypeAddress = await handlerContract.getNodeTypesAddress(name);
          const nodeTypeContract = new ethers.Contract(nodeTypeAddress, NODE_TYPE_ABI, signer);

          return {
            index,
            name,
            address: nodeTypeAddress,
            contract: nodeTypeContract,
            rewardAmount: await nodeTypeContract.rewardAmount(),
            userCount: (WalletModule.walletaddress)
              ? await nodeTypeContract.getTotalNodesNumberOf(WalletModule.walletaddress)
              : ethers.BigNumber.from(0),
          };
        })
      );


      const rewardPerClaim = nodes.reduce((acc, node) => acc.add(node.rewardAmount.mul(node.userCount).mul(PAYOUTS_PER_DAY)), ethers.BigNumber.from(0));
      this.personalStats[2].price = this.getFormattedNb(ethers.utils.formatEther(rewardPerClaim));
      
      //pendingrewards
      const [ rewards, fees ] = await handlerContract.getClaimableRewardsOf(WalletModule.walletaddress);
      this.personalStats[3].price = this.getFormattedNb(ethers.utils.formatEther(rewards._hex)) ;
    }
  }

  public intervalFetchData() : void {
    setInterval(() => {
      this.ProtocolData();
      this.personalData();
    }, 5000);
  }

  private async created() : Promise<void> {
    this.ProtocolData();    
    this.personalData();
    this.intervalFetchData();
  }
}
</script>



