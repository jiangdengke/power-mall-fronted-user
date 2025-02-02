import axios from 'axios'
import store from '@/store'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token到请求头
    const token = store.getters['user/token']
    if (token) {
      config.headers['power-mall-token'] = token
    }

    // 打印所有请求的详细信息
    console.log('=== 请求详情 ===')
    console.log('完整URL:', `${config.baseURL}${config.url}`)
    console.log('请求方法:', config.method)
    console.log('请求参数:', config.params || config.data)
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    console.log('=== 响应数据 ===', response.data)
    const res = response.data
    if (res.code === 200) {
      return res
    }
    // 非 200 状态码，返回空数据
    return {
      code: 200,
      data: [],
      message: res.message || '暂无数据'
    }
  },
  error => {
    console.log('=== 错误详情 ===')
    console.log('错误信息:', error.message)
    console.log('错误响应:', error.response)
    
    // 如果是 404，返回空数组
    if (error.response && error.response.status === 404) {
      return {
        code: 200,
        data: [],
        message: '暂无数据'
      }
    }
    
    // 其他错误返回空数组，不再抛出错误
    return {
      code: 200,
      data: [],
      message: '暂无数据'
    }
  }
)

export default service