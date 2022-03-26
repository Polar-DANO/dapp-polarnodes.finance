import { MutationTree, ActionTree, GetterTree } from 'vuex'
import axios from 'axios'

export const state = () => ({
  price: null as (number | null),
  percentage24h: null as (number | null),
  marketCap: null as (number | null),
  totalSupply: 1000000 as (number | null)
})

type State = ReturnType<typeof state>

export const getters: GetterTree<State, {}> = {
  isDataReady: store => !!store.price && !!store.percentage24h && !!store.marketCap && !!store.totalSupply
}

export const mutations: MutationTree<State> = {
  setPrice (state, price: number) {
    state.price = price
  },

  setPercentage24h (state, percentage24h: number) {
    state.percentage24h = percentage24h
  },

  setMarketCap (state, marketCap: number) {
    state.marketCap = marketCap
  },

  setTotalSupply (state, totalSupply: number) {
    state.totalSupply = totalSupply
  }
}

export const actions: ActionTree<State, {}> = {
  async loadCoinData ({ commit }) {
    const params = {
      contract_addresses: '0x6c1c0319d8ddcb0ffe1a68c5b3829fd361587db4',
      vs_currencies: 'usd',
      include_market_cap: true,
      include_24hr_vol: true,
      include_24hr_change: true,
      include_last_updated_at: true
    }

    await axios
      .get(
        'https://api.coingecko.com/api/v3/simple/token_price/avalanche', { params, headers: { 'Access-Control-Allow-Origin': '*' } }
      )
      .then((response: any) => {
        const keyArray = Object.keys(response.data)

        commit('setPrice', response.data[keyArray[0]].usd)
        commit('setPercentage24h', response.data[keyArray[0]].usd_24h_change)
        commit('setMarketCap', response.data[keyArray[0]].usd * 1000000)
      })
  }
}
