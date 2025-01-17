import request from '@/utils/request'

// 获取轮播图列表
export function getCarouselList() {
  return request({
    url: '/api/cms/home/swiper',
    method: 'get'
  })
} 