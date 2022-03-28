import { MutationTree } from 'vuex'
import { NFTTypeFilter, State, ViewType } from './state'

const mutations: MutationTree<State> = {
  setView (state, view: ViewType) {
    if (!ViewType[view]) { return }
    state.viewType = view
  },

  setFilter (state, filter: NFTTypeFilter[]) {
    state.filter = filter
  }
}

export default mutations
