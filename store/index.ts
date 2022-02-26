/*export const strict = false;

export const state = () => ({
    address: {
        type: String,
        default : ""
    }
});

export const getters = {
    loggedInUser(state : any) {
        try {
            var tempData = localStorage.getItem("data")
            if(tempData)
            {
                var temp = JSON.parse(tempData)
                state.address = temp.address
            }
            console.log(state.address)
            return state.address
        } catch {
            state.address = null
        }
    },
};


export const mutations = {};

export const actions = {};
*/

import { Store } from 'vuex'
import { getModule } from 'nuxt-property-decorator'
import { registerStoragePersistPlugins } from './plugins'
import Wallet from '~/store/wallet'

let WalletModule: Wallet

const initializer = (store: Store<{}>) => {
  WalletModule = getModule<Wallet>(Wallet, store)
}
export const plugins = [initializer, registerStoragePersistPlugins]

export {
    WalletModule
}
