<template>
  <div class="header">
    <div class="header-content">
      <!-- 左侧 logo 和 GitHub 链接 -->
      <div class="left-section">
        <div class="logo" @click="$router.push('/')">
          <svg viewBox="0 0 24 24" width="28" height="28" class="logo-icon">
            <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0020.01 4H5.21l-.67-1.43a.993.993 0 00-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <span>商城</span>
        </div>
        <a href="https://github.com/jiangdengke/POWERMALL" 
           target="_blank" 
           class="github-link">
          <svg height="24" viewBox="0 0 16 16" width="24" class="github-icon">
            <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          <span>GitHub</span>
        </a>
        <!-- 添加搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品"
            clearable
            @keyup.enter.native="handleSearch">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>
      </div>

      <!-- 右侧用户区域 -->
      <div class="user-area">
        <!-- 未登录状态 -->
        <template v-if="!isLogin">
          <el-button type="text" @click="$router.push('/login')">
            <i class="el-icon-user"></i> 登录
          </el-button>
          <el-button type="text" @click="$router.push('/register')">
            <i class="el-icon-plus"></i> 注册
          </el-button>
        </template>

        <!-- 已登录状态 -->
        <template v-else>
          <!-- 购物车按钮 -->
          <div class="nav-item" @click="$router.push('/cart')">
            <el-badge :value="cartCount" :hidden="!cartCount">
              <i class="el-icon-shopping-cart-2"></i>
            </el-badge>
            <span>购物车</span>
          </div>

          <!-- 订单按钮 -->
          <div class="nav-item" @click="$router.push('/orders')">
            <i class="el-icon-document"></i>
            <span>我的订单</span>
          </div>

          <!-- 用户信息下拉菜单 -->
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
              <el-dropdown-item command="logout">
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
      cartCount: 0,
      searchKeyword: ''
    }
  },
  computed: {
    ...mapGetters('user', ['isLogin', 'userInfo'])
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout()
      }
    },
    handleLogout() {
      this.$store.dispatch('user/logout')
      this.$message.success('退出成功')
      this.$router.push('/login')
    },
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        return
      }

      // 更新路由参数
      this.$router.push({
        path: '/goods/search',
        query: { 
          keyword: this.searchKeyword.trim(),
          _t: Date.now() // 添加时间戳确保路由参数变化
        }
      }).catch(err => {
        // 忽略重复导航错误
        if (err.name !== 'NavigationDuplicated') {
          throw err
        }
      })
      
      this.searchKeyword = ''
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

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #ff4d4f;
  font-size: 20px;
  font-weight: bold;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo i {
  font-size: 24px;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #24292f;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 14px;
}

.github-link:hover {
  background: #f6f8fa;
  color: #0969da;
}

.github-icon {
  transition: transform 0.3s;
}

.github-link:hover .github-icon {
  transform: scale(1.1);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
  color: #666;
}

.nav-item:hover {
  background: #fff0f0;
  color: #ff4d4f;
}

.nav-item i {
  font-size: 20px;
}

.nav-item span {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
}

:deep(.el-badge__content) {
  background-color: #ff4d4f;
}

:deep(.el-button--text) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

:deep(.el-button--text:hover) {
  color: #ff4d4f;
}

:deep(.el-button--text i) {
  font-size: 16px;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item i) {
  font-size: 16px;
}

.logo-icon {
  color: currentColor;
  transition: transform 0.3s;
}

.logo:hover .logo-icon {
  transform: scale(1.1);
}

.search-box {
  width: 300px;
  margin-left: 20px;
}

.search-box :deep(.el-input__inner) {
  border-radius: 20px 0 0 20px;
  border-right: none;
}

.search-box :deep(.el-input-group__append) {
  border-radius: 0 20px 20px 0;
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

.search-box :deep(.el-input-group__append:hover) {
  background: #ff7875;
  border-color: #ff7875;
}

.search-box :deep(.el-input-group__append .el-icon-search) {
  font-weight: bold;
}
</style> 