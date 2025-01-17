import { getCarouselList } from '@/api/cms'

const state = {
  carouselList: []
}

const mutations = {
  SET_CAROUSEL_LIST(state, list) {
    state.carouselList = list
  }
}

const actions = {
  // 获取轮播图列表
  async fetchCarouselList({ commit }) {
    console.log('开始请求轮播图数据...')
    try {
      const response = await getCarouselList()
      console.log('轮播图请求成功，响应数据:', response)
      commit('SET_CAROUSEL_LIST', response.data)
      return response
    } catch (error) {
      console.error('轮播图请求失败:', error)
      throw error
    }
  }
}

const getters = {
  carouselList: state => state.carouselList
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 