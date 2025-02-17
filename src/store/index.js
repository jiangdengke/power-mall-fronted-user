import Vue from 'vue'
import Vuex from 'vuex'
import category from './modules/category'
import cms from './modules/cms'
import user from './modules/user'
import search from './modules/search'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    category,
    cms,
    user,
    search
  }
})
