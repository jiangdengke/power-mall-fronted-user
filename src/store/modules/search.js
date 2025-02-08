const state = {
  refreshSearch: false
}

const mutations = {
  TOGGLE_REFRESH(state) {
    state.refreshSearch = !state.refreshSearch
  }
}

const actions = {
  triggerSearch({ commit }) {
    commit('TOGGLE_REFRESH')
  }
}

const getters = {
  refreshSearch: state => state.refreshSearch
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 