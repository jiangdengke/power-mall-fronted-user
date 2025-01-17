import request from '@/utils/request'

// 获取商品分类树形列表
export function getCategoryTree() {
  return request({
    url: '/api/pms',
    method: 'get'
  })
} 