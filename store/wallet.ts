import { GetterTree, MutationTree, ActionTree } from 'vuex'

export const state = () => ({
  address: null as (string | null)
})

export type State = ReturnType<typeof state>;

export const getters: GetterTree<State, {}> = {
  address: store => store.address,
  hasAddress: store => !!store.address
}

export const mutations: MutationTree<State> = {
  setAddress (state, address: string) {
    state.address = address
  }
}

export const actions: ActionTree<State, {}> = {
  async loadAddress ({ commit }) {
    try {
      commit('setAddress', await this.$web3Provider.getSigner().getAddress())
    } catch (err) {
      console.log(err)
      commit('setAddress', null)
    }
  }
}
