<template>
  <div class="goods-list">
    <div class="page-header">
      <h2>商品列表</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="goods-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <el-skeleton :rows="5" animated />
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="goodsList.length === 0" class="empty">
        <el-empty description="暂无商品数据"></el-empty>
      </div>
      
      <!-- 商品列表 -->
      <div v-else class="goods-grid">
        <GoodsCard
          v-for="item in goodsList"
          :key="item.id"
          :goods="item"
          @click="handleGoodsClick"
          @buy="handleGoodsBuy"
        />
      </div>
      
      <!-- 分页 -->
      <div class="pagination" v-if="total > 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getGoodsList } from '@/api/pms'
import GoodsCard from '@/components/GoodsCard.vue'

export default {
  name: 'GoodsList',
  components: {
    GoodsCard
  },
  data() {
    return {
      goodsList: [],
      loading: false,
      currentPage: 1,
      pageSize: 12,
      total: 0,
      categoryId: null
    }
  },
  created() {
    // 从路由参数获取分类ID
    this.categoryId = this.$route.params.categoryId
    this.fetchGoodsList()
  },
  methods: {
    async fetchGoodsList() {
      this.loading = true
      try {
        const res = await getGoodsList(this.categoryId)
        if (res.code === 200) {
          this.goodsList = res.data
          this.total = res.data.length
        }
      } finally {
        this.loading = false
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchGoodsList()
    },
    handleGoodsClick(goods) {
      // 检查登录状态
      if (!this.$store.getters['user/isLogin']) {
        this.$message({
          message: '请先登录',
          type: 'warning'
        })
        this.$router.push({
          path: '/login',
          query: { redirect: `/goods/detail/${goods.id}` }
        })
        return
      }
      this.$router.push(`/goods/detail/${goods.id}`)
    },
    handleGoodsBuy(goods) {
      // 检查登录状态
      if (!this.$store.getters['user/isLogin']) {
        this.$message({
          message: '请先登录',
          type: 'warning'
        })
        this.$router.push({
          path: '/login',
          query: { redirect: `/goods/detail/${goods.id}` }
        })
        return
      }
      this.$router.push(`/goods/detail/${goods.id}`)
    }
  }
}
</script>

<style scoped>
.goods-list {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.goods-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.loading, .empty {
  padding: 40px 0;
  text-align: center;
}

.pagination {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style> 