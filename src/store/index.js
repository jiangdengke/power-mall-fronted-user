import Vue from 'vue'
import Vuex from 'vuex'
import category from './modules/category'
import cms from './modules/cms'

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
    cms
  }
})
