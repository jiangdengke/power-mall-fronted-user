<template>
  <div class="search-page">
    <div class="search-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品搜索</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索条件 -->
    <div class="search-form">
      <el-form :model="searchForm" :inline="true" size="small">
        <!-- 关键词搜索 -->
        <el-form-item>
          <el-input
            v-model="searchForm.name"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter.native="handleSearch">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 空状态 -->
    <div v-else-if="!goodsList.length" class="empty-state">
      <el-empty description="暂无相关商品"></el-empty>
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
        :current-page.sync="searchForm.current"
        :page-size="searchForm.size"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { searchGoods } from '@/api/pms'
import GoodsCard from '@/components/GoodsCard.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsSearch',
  components: {
    GoodsCard
  },
  computed: {
    ...mapGetters('search', ['refreshSearch'])
  },
  data() {
    return {
      loading: false,
      searchForm: {
        name: '',
        categoryId: undefined,
        gtePrice: undefined,
        ltePrice: undefined,
        orderBy: '',
        direction: '',
        current: 1,
        size: 12
      },
      goodsList: [],
      total: 0
    }
  },
  watch: {
    // 监听路由参数变化
    '$route.query': {
      handler(newQuery) {
        // 更新搜索关键词并执行搜索
        this.searchForm.name = newQuery.keyword || ''
        this.handleSearch()
      },
      immediate: true
    },
    // 监听搜索刷新状态
    refreshSearch() {
      this.handleSearch()
    }
  },
  created() {
    // 从路由参数获取搜索关键词
    const { keyword } = this.$route.query
    if (keyword) {
      this.searchForm.name = keyword
    }
    this.fetchSearchResult()
  },
  methods: {
    // 获取搜索结果
    async fetchSearchResult() {
      this.loading = true
      try {
        const res = await searchGoods(this.searchForm)
        console.log('搜索结果:', res)
        
        if (res.code === 200) {
          this.goodsList = res.data
          this.total = res.data.length
        } else {
          this.$message.error(res.message || '搜索失败')
          this.goodsList = []
          this.total = 0
        }
      } catch (error) {
        console.error('搜索失败:', error)
        this.$message.error('搜索失败')
        this.goodsList = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
    // 处理搜索
    handleSearch() {
      this.fetchSearchResult()
    },
    // 处理页码变化
    handlePageChange(page) {
      this.searchForm.current = page
      this.fetchSearchResult()
    },
    // 点击商品卡片
    handleGoodsClick(goods) {
      this.$router.push(`/goods/detail/${goods.id}`)
    },
    // 立即购买
    handleGoodsBuy(goods) {
      this.$router.push(`/goods/detail/${goods.id}`)
    }
  }
}
</script>

<style scoped>
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.price-separator {
  margin: 0 10px;
  color: #999;
}

.loading-state, .empty-state {
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 20px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style> 