import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 只打印轮播图相关的请求
    // if (config.url.includes('swiper')) {
    //   console.log('=== 轮播图请求详情 ===')
    //   console.log('完整请求路径:', `${config.baseURL}${config.url}`)
    //   console.log('请求方法:', config.method)
    // }
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
    // 只打印轮播图相关的响应
    // if (response.config.url.includes('swiper')) {
    //   console.log('=== 轮播图响应详情 ===')
    //   console.log('响应数据:', response.data)
    // }
    return response.data
  },
  error => {
    console.error('请求失败:', error.message)
    Message({
      message: error.message || '请求失败',
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service