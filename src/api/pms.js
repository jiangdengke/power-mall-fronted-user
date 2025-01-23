import request from '@/utils/request'

// 获取商品分类树形列表
export function getCategoryTree() {
  return request({
    url: '/api/pms',
    method: 'get'
  })
}

// 根据分类ID获取商品列表
export function getGoodsList(categoryId) {
  return request({
    url: '/api/pms/goods/list',
    method: 'get',
    params: {
      categoryId
    }
  })
}

// 获取所有商品列表
export function getAllGoods() {
  return request({
    url: '/mall/api/goods/list',
    method: 'get'
  })
} 