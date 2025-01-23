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
        <el-card v-for="item in goodsList" 
                :key="item.id" 
                class="goods-item"
                shadow="hover">
          <img :src="item.img" :alt="item.name" class="goods-img">
          <div class="goods-info">
            <h3 class="goods-name">{{ item.name }}</h3>
            <div class="goods-detail">
              <div class="goods-price">¥{{ (item.price / 100).toFixed(2) }}</div>
              <div class="goods-sales">销量: {{ item.sales }}</div>
            </div>
            <div class="goods-stock">库存: {{ item.totalStock }}</div>
            <div v-if="item.status === 0" class="goods-status off">已下架</div>
            <div v-else class="goods-status on">在售</div>
          </div>
        </el-card>
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

export default {
  name: 'GoodsList',
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
        this.goodsList = res.data
        this.total = res.data.length
      } finally {
        this.loading = false
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchGoodsList()
    }
  }
}
</script>

<style scoped>
.goods-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin-bottom: 10px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.goods-item {
  cursor: pointer;
  transition: all 0.3s;
}

.goods-item:hover {
  transform: translateY(-5px);
}

.goods-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.goods-info {
  padding: 10px;
}

.goods-name {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.goods-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.goods-sales {
  color: #909399;
  font-size: 12px;
}

.goods-stock {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}

.goods-status {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 5px;
}

.goods-status.on {
  background-color: #67c23a;
  color: white;
}

.goods-status.off {
  background-color: #909399;
  color: white;
}

.loading, .empty {
  padding: 40px 0;
  text-align: center;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}
</style> 