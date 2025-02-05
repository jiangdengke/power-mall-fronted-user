<template>
  <div class="header">
    <div class="header-content">
      <!-- 左侧 logo -->
      <div class="logo" @click="$router.push('/')">
        <i class="el-icon-shopping-bag-1"></i>
        <span>商城</span>
      </div>

      <!-- 右侧用户区域 -->
      <div class="user-area">
        <!-- 未登录状态 -->
        <template v-if="!isLogin">
          <el-button type="text" @click="$router.push('/login')">登录</el-button>
          <el-button type="text" @click="$router.push('/register')">注册</el-button>
        </template>

        <!-- 已登录状态 -->
        <template v-else>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="user-info">
              <template v-if="userInfo.avatar">
                <el-avatar :size="32" :src="userInfo.avatar"></el-avatar>
              </template>
              <template v-else>
                <el-avatar :size="32" icon="el-icon-user"></el-avatar>
              </template>
              <span class="username">{{ userInfo.username }}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="orders">
                <i class="el-icon-document"></i> 我的订单
              </el-dropdown-item>
              <el-dropdown-item command="cart">
                <i class="el-icon-shopping-cart-2"></i> 购物车
                <el-badge :value="cartCount" class="cart-badge" v-if="cartCount > 0"/>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <i class="el-icon-switch-button"></i> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppHeader',
  data() {
    return {
      cartCount: 0
    }
  },
  computed: {
    ...mapGetters('user', ['isLogin', 'userInfo'])
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'orders':
          if (this.$route.path !== '/orders') {
            this.$router.push('/orders')
          }
          break
        case 'cart':
          if (this.$route.path !== '/cart') {
            this.$router.push('/cart')
          }
          break
        case 'logout':
          this.handleLogout()
          break
      }
    },
    handleLogout() {
      this.$store.dispatch('user/logout')
      this.$message.success('退出成功')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #ff4d4f;
  font-size: 20px;
  font-weight: bold;
}

.logo i {
  font-size: 24px;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  font-size: 14px;
}

.cart-badge {
  margin-left: 5px;
}

:deep(.el-badge__content) {
  background-color: #ff4d4f;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 5px;
}

:deep(.el-dropdown-menu__item i) {
  font-size: 16px;
}
</style> 