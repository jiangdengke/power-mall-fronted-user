import { login } from '@/api/ums'

const state = {
  token: localStorage.getItem('power-mall-token'),
  isLogin: !!localStorage.getItem('power-mall-token')
}

const mutations = {
  SET_TOKEN(state, tokenInfo) {
    state.token = tokenInfo.tokenValue
    state.isLogin = true
    localStorage.setItem('power-mall-token', tokenInfo.tokenValue)
  },
  CLEAR_USER(state) {
    state.token = null
    state.isLogin = false
    localStorage.removeItem('power-mall-token')
  }
}

const actions = {
  // 用户登录
  async login({ commit }, loginForm) {
    try {
      const res = await login(loginForm)
      console.log('登录响应:', res)
      if (res.code === 200 && res.data) {
        commit('SET_TOKEN', res.data)
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  },
  
  // 退出登录
  logout({ commit }) {
    commit('CLEAR_USER')
  }
}

const getters = {
  isLogin: state => state.isLogin,
  token: state => state.token
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 