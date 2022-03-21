<template>
  <v-dialog
    v-model="dialog"
    width="600"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="flex flex-col align-center md:flex md:flex-row justify-end md:mt-[24px] md:mr-[24px] gap-[16px]">
        <div class="mt-0">
          
            <!-- <v-btn          
              x-large
              elevation="0"
              v-bind="attrs"
              @click = "buyPolar"
              class="bg-[#00C6ED] rounded-[14px] w-[188px] md:w-[204px] h-[40px]"
            > -->
            <a href="https://traderjoexyz.com/trade?outputCurrency=0x6c1c0319d8ddcb0ffe1a68c5b3829fd361587db4#/" target="_blank">
              <div class="flex flex-row justify-center mx-[24px] normal-case bg-[#00C6ED] rounded-[14px] w-[188px] md:w-[204px] h-[40px]">
                <img class="mr-[10px] p-[6px]" :src="require('../assets/img/buypolar.svg')" alt="">
                <span class="text-[14px] text-[#FFFFFF]  py-[12px] font-semibold">Buy $ POLAR</span>
              </div>
            </a>
            <!-- </v-btn> -->
          
        </div>
        <div class="mt-0" v-if="!isLoggIn">
          <v-btn          
            x-large
            elevation="0"
            v-bind="attrs"
            v-on="on"
            class="bg-[#00C6ED] rounded-[14px]  w-[188px] md:w-[204px] h-[40px]"
            
          >
            <div class="flex flex-row justify-center mx-[34px] normal-case">
              <img class="mr-[10px]" :src="require('../assets/img/wallet.svg')" alt="">
              <span class="text-[14px] text-white py-[12px] font-semibold">{{ $t("connexion") }}</span>
            </div>
          </v-btn>
        </div>
        <div class="mt-0" v-if="isLoggIn">
          <v-btn          
            x-large
            elevation="0"
            v-bind="attrs"
            class="bg-[#00C6ED] rounded-[14px]  w-[188px] md:w-[204px] h-[40px]"
            @click = "logout"
          >
            <div class="flex flex-row justify-center mx-[34px] normal-case">
              <img class="mr-[10px]" :src="require('../assets/img/wallet.svg')" alt="">
              <span class="text-[14px] text-white py-[12px] font-semibold cursor-pointer">{{walletAddress.slice(0, 5) + '...'+ walletAddress.slice(-4, walletAddress.length)}}</span>
            </div>          
          </v-btn>
        </div>
     </div>
    </template>

    <v-card class="bg-[#17171B] rounded-[16px]">      
      <v-btn class="absolute right-2" icon @click="dialog = false">
        <v-icon class="text-white">mdi-close</v-icon>
      </v-btn>
      <div class="text-center text-white rounded-[50px] px-[10px] py-[20px]">
        <v-card-text>
          <div class="text-h4 text-[#b1ebfc] font-bold">
            {{ $t("connect-wallet") }}
          </div>
          <div class="p-[3px]">
            {{ $t("connect1") }}<br />
            {{ $t("connect2") }}
          </div>
        </v-card-text>
        <v-btn x-large @click="requestMetaMask" class="bg-[#00C6ED] relative justify-start mb-[10px] text-[20px] rounded-[12px] md:w-7/12 w-[280px] normal-case"
          ><img class="w-[32px] h-[32px] mr-[10px]" src="~/assets/img/metamask-logo.svg" /><span class="text-white">
            MetaMask</span
          ><img class="absolute right-[-15px]" src="~/assets/img/fleche-wallet.svg"
        /></v-btn>

        <v-btn x-large @click="requestWalletAccounts" class="bg-[#00C6ED] relative justify-start mb-[10px] text-[20px] rounded-[12px] md:w-7/12 w-[280px] normal-case"
          ><img class="w-[32px] h-[32px] mr-[10px]" src="~/assets/img/walletconnect.svg" /><span class="text-white">
            Wallet Connect</span
          ><img class="absolute right-[-15px]" src="~/assets/img/fleche-wallet.svg"
        /></v-btn>
      </div>
      <v-divider></v-divider>
    </v-card>
      <v-alert
        class="m-5"
        type="info"
        color="red"
        :value="acceptMetamask"
        dismissible        
        transition="scale-transition"
      >
        You must accept the connection with MetaMask
      </v-alert>
      <v-alert        
        type="info"
        color="red"
        :value="noProvider"
        dismissible        
        transition="scale-transition"
      >
        You must install MetaMask
      </v-alert>
      </v-alert>
      <v-alert        
        type="info"
        color="red"
        :value="wrongNetwork"
        dismissible        
        transition="scale-transition"
      >
        You need to connect to the Avalanche Network
      </v-alert>
  </v-dialog>  
</template>
<script lang="ts">
import { mapGetters } from "vuex"
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Connexion from "~/helpers/connexion.js"
import {ethers} from "ethers"
import Web3 from "web3"
import WalletConnectProvider from "@walletconnect/web3-provider"
import {WalletModule} from '~/store'
import AlertComponents from '~/components/AlertComponents.vue'
import Default from "~/layouts/default.vue"
import detectEthereumProvider from '@metamask/detect-provider'

declare let window: any;

@Component ({
  components: {AlertComponents}
})
export default class ConnectionBtn extends Vue {
  private wrongNetwork = false
  private noProvider = false
  private acceptMetamask = false
  private dialog = false
  private isLoggIn = false
  private walletAddress = ''
  private metamaskProvider : any

  public async sleep(ms : any) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
  }

  public setWalletAddress(address : string) : void {
    this.walletAddress = address
  }

  private get loadWalletAddress (): string {
    return WalletModule.walletaddress
  }

  public async created() {
      const self = this
      // detect Metamask account change
      window.ethereum.on('accountsChanged', function (accounts : string[]) {
        console.log('accountsChanges',accounts)
        WalletModule.setAddress(accounts[0])
        self.walletAddress = accounts[0]
      });
  
      // detect Network account change
      window.ethereum.on('networkChanged', async function(networkId : any){
        console.log('networkChanged',networkId)
        if(networkId != 0xa86a) {            
          (self.$root.$refs.alert as Default).WrongNetwork()
          await self.sleep(1500)          
        }
      });

    try {
      WalletModule.loadWalletAddress();
      if(this.loadWalletAddress) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if(accounts[0] != this.loadWalletAddress) {
        WalletModule.setAddress(accounts[0])
        this.walletAddress = accounts[0]
        console.log(this.walletAddress)            
        } else {
          this.walletAddress = this.loadWalletAddress
        }
        if(this.walletAddress) {
          this.isLoggIn = true
        }        
      }      
    } catch {

    }
  }

  public async requestMetaMask() {
    this.metamaskProvider = await detectEthereumProvider({
      mustBeMetaMask: true
    })
    if (this.metamaskProvider) {
      try {
        await this.metamaskProvider.request({ method: 'eth_requestAccounts'}).then(async(accounts:any) => {
          await this.wallet_addAvalanche(this.metamaskProvider).then(async(res : any)=> {
            await this.metamaskProvider.request({
              method: 'eth_chainId'
            }).then(async(chainId : any) => {
              if (chainId == 0xa86a || chainId == 0x1 || chainId == 0x539) {                             
                WalletModule.setAddress(accounts[0])
                this.walletAddress = accounts[0]
                this.isLoggIn = true
                this.dialog = false                          
                await (this.$root.$refs.alert as Default).WalletConnectOk()                              
                return
              } else {                            
                this.wrongNetwork = true
                await this.sleep(1500)
                this.wrongNetwork = false
                this.dialog = false                           
                return
              }
            })
          })
        })
      } catch(err) {
        console.log(err)        
        this.acceptMetamask = true
        await this.sleep(1500)
        this.acceptMetamask = false
        this.dialog = false      
        return
      }  
    } else {
      this.noProvider = true
      await this.sleep(1500)
      this.noProvider = false
      this.dialog = false
      return
    }
  }

  public async wallet_addAvalanche(provider : any) {
    /*await provider.send("wallet_addEthereumChain", [{
        chainId: "0xa86a",
        chainName: "Avalanche Network",
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io/"],
        nativeCurrency: {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18
        },
    },])*/
    // await provider.request({
    //   method : "wallet_addEthereumChain",
    //   params : [{
    //     chainId: "0xa86a",
    //     chainName: "Avalanche Network",
    //     rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    //     blockExplorerUrls: ["https://snowtrace.io/"],
    //     nativeCurrency: {
    //         name: "AVAX",
    //         symbol: "AVAX",
    //         decimals: 18
    //     },
    // },]})
  }

  public async requestWalletAccounts() {    
    const web3Provider = new WalletConnectProvider({
        rpc: {
          97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
          56: "https://bsc-dataseed1.binance.org/",
        },
        bridge: "https://bridge.myhostedserver.com",
        qrcodeModalOptions: {
          mobileLinks: [
            "metamask",
            "trust",
          ],
        },
    });
    
    //const web3 = new Web3(web3Provider);

    await web3Provider.enable().then( async(res) => {
        //this.dialog = false     
        //const accounts = await web3.eth.getAccounts();
        await this.wallet_addAvalanche(web3Provider).then(async(res) => {
          /*
          await web3Provider.send("eth_chainId", []).then(async(res : any) => {                                    
            if (res == 0xa86a) {                            
              WalletModule.setAddress(accounts[0])                            
              this.walletAddress = accounts[0]
              this.isLoggIn = true                        
              return
            } else {
              this.wrongNetwork = true
              await this.sleep(1500)
              this.wrongNetwork = false                                        
              return
            }
          });*/ 
        })
        /*if(accounts) {                    
          console.log(accounts);
        }*/
    });          
  }
  
  public logout() {
    WalletModule.clearWallet()
    this.isLoggIn = false
  }

  public buyPolar() {

  }
}
</script>

