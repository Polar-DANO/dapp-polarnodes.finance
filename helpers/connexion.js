import {ethers} from "ethers";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

export default {
    data() {
        return {
            dialog: false,
            noProvider: false,
            acceptMetamask: false,
            wrongNetwork: false
        };
    },

    methods: {
        
        async sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        },

        async requestMetaMask() {
            const ethereum = window.ethereum    
            if (ethereum) {
                try {
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    if(provider) {
                        try {                            
                            await this.wallet_addAvalanche(provider).then(async(res)=> {
                                
                                await provider.send("eth_chainId", []).then(async(res) => {                                    
                                    if (res == 0xa86a) {
                                        this.$store.state.address = accounts[0];
                                        let jsonData = localStorage.getItem("data");
                                        let data = {
                                            address : ""
                                        };
                                        if(jsonData) {
                                            data = JSON.parse(jsonData);
                                        }                                        
                                        data.address = accounts[0];
                                        localStorage.setItem("data", JSON.stringify(data));                                                                                
                                        this.dialog = false;
                                        this.$router.app.refresh()
                                        return
                                    } else {
                                        this.wrongNetwork = true;
                                        await this.sleep(1500);
                                        this.wrongNetwork = false;
                                        this.dialog = false;
                                        this.$router.app.refresh()
                                        return
                                    }
                                });
                                
                            });
                        } catch {
                            this.wrongNetwork = true;
                            await this.sleep(1500);
                            this.wrongNetwork = false;
                            this.dialog = false;
                            this.$router.app.refresh()
                            return
                        }
                    }
                    
                } catch(err) {       
                    console.log(err);
                    this.acceptMetamask = true;
                    await this.sleep(1500);
                    this.acceptMetamask = false;
                    this.dialog = false;
                    this.$router.app.refresh()
                    return

                }
            } else {                
                this.noProvider = true;
                await this.sleep(1500);
                this.noProvider = false;
                this.dialog = false;
                this.$router.app.refresh()
                return
            }

        },

        async requestWalletAccounts() {
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
            
            const web3 = new Web3(web3Provider);

            await web3Provider.enable().then( async(res) => {       
                const accounts = await web3.eth.getAccounts();
                await this.wallet_addAvalanche(provider);
                if(accounts) {                    
                    
                }
            });
            
        },

        async wallet_addAvalanche(provider) {
            await provider.send("wallet_addEthereumChain", [{
                chainId: "0xa86a",
                chainName: "Avalanche Network",
                rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
                blockExplorerUrls: ["https://snowtrace.io/"],
                nativeCurrency: {
                    name: "AVAX",
                    symbol: "AVAX",
                    decimals: 18
                },
            },])
        },

        async logout() {
            var temp = JSON.parse(localStorage.getItem("data"));
            temp.address = null;
            localStorage.setItem("data", JSON.stringify(temp));
            this.$store.state.address = "";
            this.$store.state.button = false;
            this.$router.app.refresh()

        },
    },
};