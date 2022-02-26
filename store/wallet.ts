import { Module, VuexAction, VuexMutation } from 'nuxt-property-decorator'
import { VuexModule } from '~/models'

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'wallet'
})
export default class Wallet extends VuexModule {
  public address: string = ''

  public get walletaddress (): string {
    return this.address
  }

  @VuexMutation
  public setAddress (address: string): void {
    this.address = address
    let jsonData = localStorage.getItem("data");
    let data = {
        address : ''
    };
    if(jsonData) {
        data = JSON.parse(jsonData);
    }                                        
    data.address = address;
    localStorage.setItem("data", JSON.stringify(data));    
  }

  @VuexMutation
  public loadWalletAddress() : void {       
    let jsonData = localStorage.getItem("data");
    let data = {
        address : ''
    };
    if(jsonData) {
        data = JSON.parse(jsonData);
    }                                        
    this.address = data.address;    
  }

  @VuexMutation
  public clearWallet() : void {       
    let jsonData = localStorage.getItem("data");
    let data = {
        address : ''
    };
    if(jsonData) {
        data = JSON.parse(jsonData);
    }                                        
    data.address = ''
    this.address = '';
    localStorage.setItem("data", JSON.stringify(data));   
  }
/*
  @VuexAction  
  public loggedInUser(): string {
    return this.address
  }*/
}
