import { login } from '@/api/ums'

const state = {
  token: localStorage.getItem('power-mall-token'),
  isLogin: !!localStorage.getItem('power-mall-token'),
  userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
}

const mutations = {
  SET_USER_DATA(state, data) {
    // 设置 token
    state.token = data.saTokenInfo.tokenValue
    state.isLogin = true
    localStorage.setItem('power-mall-token', data.saTokenInfo.tokenValue)
    
    // 设置用户信息
    state.userInfo = {
      username: data.username,
      avatar: data.avatar,
      mail: data.mail
    }
    localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
  },
  CLEAR_USER(state) {
    state.token = null
    state.isLogin = false
    state.userInfo = {}
    localStorage.removeItem('power-mall-token')
    localStorage.removeItem('userInfo')
  }
}

const actions = {
  // 用户登录
  async login({ commit }, loginForm) {
    try {
      const res = await login(loginForm)
      console.log('登录响应:', res)
      if (res.code === 200 && res.data) {
        commit('SET_USER_DATA', res.data)
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
  token: state => state.token,
  userInfo: state => state.userInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 