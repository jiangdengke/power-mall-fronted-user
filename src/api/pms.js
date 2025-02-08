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
    url: '/api/pms/goods/all',
    method: 'get'
  })
}

// 获取商品详情
export function getGoodsDetail(id) {
  return request({
    url: `/api/pms/goods/${id}`,
    method: 'get'
  })
}

// 添加商品到购物车
export function addToCart(skuId, count) {
  return request({
    url: '/api/pms/cart/add',
    method: 'post',
    params: {
      skuId,
      count
    }
  })
}

// 获取购物车列表
export function getCartList() {
  return request({
    url: '/api/pms/cart',
    method: 'get'
  })
}

// 搜索商品
export function searchGoods(params) {
  return request({
    url: '/api/pms/goods/search',
    method: 'get',
    params: {
      name: params.name
    }
  })
} 