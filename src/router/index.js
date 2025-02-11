import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/Home.vue'
import store from '@/store'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/goods/all',
    name: 'AllGoods',
    component: () => import('@/views/goods/List.vue')
  },
  {
    path: '/goods/:categoryId',
    name: 'GoodsList',
    component: () => import('@/views/goods/List.vue')
  },
  {
    path: '/goods/detail/:id',
    name: 'GoodsDetail',
    component: () => import('@/views/goods/Detail.vue'),
    meta: { requiresAuth: true }
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
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/user/Cart.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('@/views/order/Confirm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('@/views/order/List.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/goods/search',
    name: 'GoodsSearch',
    component: () => import('@/views/goods/Search.vue')
  }
  // 以下路由等待组件创建后再启用
  // {
  //   path: '/orders',
  //   name: 'Orders',
  //   component: () => import('@/views/user/Orders.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/cart',
  //   name: 'Cart',
  //   component: () => import('@/views/user/Cart.vue'),
  //   meta: { requiresAuth: true }
  // }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查该路由是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查是否已登录
    if (!store.getters['user/isLogin']) {
      Message({
        message: '请先登录',
        type: 'warning'
      })
      // 保存要跳转的地址，登录成功后跳回来
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
