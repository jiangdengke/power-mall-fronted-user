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
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: () => import('@/views/user/Login.vue')
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: () => import('@/views/user/Register.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
