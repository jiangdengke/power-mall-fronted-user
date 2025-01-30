import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/goods/:categoryId',
    name: 'GoodsList',
    component: () => import('@/views/goods/List.vue')
  },
  {
    path: '/goods/detail/:id',
    name: 'GoodsDetail',
    component: () => import('@/views/goods/Detail.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
