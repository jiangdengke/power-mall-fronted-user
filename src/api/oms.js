import request from '@/utils/request'

// 获取订单列表
export function getOrderList() {
  return request({
    url: '/api/oms/order/list',
    method: 'get'
  })
}

// 确认订单（从商品详情页下单）
export function confirmOrder(skuId, count) {
  return request({
    url: '/api/oms/order/confirm',
    method: 'get',
    params: {
      skuId,
      count
    }
  })
}

// 确认订单（从购物车下单）
export function confirmCartOrder() {
  return request({
    url: '/api/oms/order/confirmCart',
    method: 'get'
  })
}

// 提交订单
export function submitOrder(data) {
  return request({
    url: '/api/oms/order/submit',
    method: 'post',
    data
  })
}

// 取消订单
export function cancelOrder(orderId) {
  return request({
    url: '/api/oms/order/cancel',
    method: 'put',
    params: {
      orderId
    }
  })
} 