<template>
  <div class="page-container">
    <!-- 左侧装饰 -->
    <div class="side-decoration left">
      <div class="decoration-item">
        <i class="el-icon-present"></i>
        <span>新年特惠</span>
      </div>
      <div class="decoration-item">
        <i class="el-icon-shopping-cart-2"></i>
        <span>限时秒杀</span>
      </div>
      <div class="decoration-item">
        <i class="el-icon-goods"></i>
        <span>热卖商品</span>
      </div>
    </div>

    <div class="main-content">
      <!-- 轮播图区域 -->
      <div class="swiper-section">
        <div class="category-sidebar">
          <div class="category-item" 
               v-for="item in categories" 
               :key="item.id"
               @mouseenter="handleCategoryHover(item)"
               @mouseleave="handleCategoryLeave">
            <i :class="item.icon || 'el-icon-goods'"></i>
            <span>{{ item.name }}</span>
            <i class="el-icon-arrow-right" v-if="item.children && item.children.length"></i>
            
            <!-- 二级菜单 -->
            <div class="sub-categories" v-show="activeCategory === item">
              <div class="sub-category" 
                   v-for="subItem in item.children" 
                   :key="subItem.id"
                   @mouseenter="handleSubCategoryHover(subItem)"
                   @mouseleave="handleSubCategoryLeave">
                <span>{{ subItem.name }}</span>
                <i class="el-icon-arrow-right" v-if="subItem.children && subItem.children.length"></i>
                
                <!-- 三级菜单 -->
                <div class="third-categories" v-show="activeSubCategory === subItem">
                  <div class="third-category" 
                       v-for="thirdItem in subItem.children" 
                       :key="thirdItem.id"
                       @click="handleCategoryClick(thirdItem)">
                    <span>{{ thirdItem.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-container">
          <div class="home-swiper">
            <el-carousel height="300px" :interval="4000">
              <el-carousel-item v-for="item in swiperList" :key="item.title">
                <a :href="item.redirectUrl" target="_blank" class="swiper-link">
                  <img :src="item.img" :alt="item.title" class="swiper-img">
                  <div class="swiper-info">
                    <h3>{{ item.title }}</h3>
                  </div>
                </a>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="promo-cards">
            <div class="promo-card">
              <i class="el-icon-shopping-cart-2"></i>
              <span>限时特惠</span>
            </div>
            <div class="promo-card">
              <i class="el-icon-present"></i>
              <span>新品上市</span>
            </div>
            <div class="promo-card">
              <i class="el-icon-medal"></i>
              <span>品质优选</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品展示区域 -->
      <div class="goods-section" style="margin-top: 30px;">
        <div class="section-header">
          <h2>热门商品</h2>
          <el-button type="text" @click="$router.push('/goods/all')">
            查看更多 <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <el-skeleton :rows="5" animated />
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="!goodsList || goodsList.length === 0" class="empty-state">
          <el-empty description="暂无商品数据"></el-empty>
        </div>
        
        <!-- 商品网格 -->
        <div v-else class="goods-grid">
          <GoodsCard
            v-for="item in goodsList"
            :key="item.id"
            :goods="item"
            @click="handleGoodsClick"
            @buy="handleGoodsBuy"
          />
        </div>
      </div>

    </div>

    <!-- 右侧装饰 -->
    <div class="side-decoration right">
      <div class="decoration-item">
        <i class="el-icon-medal"></i>
        <span>品质优选</span>
      </div>
      <div class="decoration-item">
        <i class="el-icon-money"></i>
        <span>优惠券</span>
      </div>
      <div class="decoration-item">
        <i class="el-icon-service"></i>
        <span>客服中心</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCarouselList } from '@/api/cms'
import { getCategoryTree, getAllGoods } from '@/api/pms'
import GoodsCard from '@/components/GoodsCard.vue'

export default {
  name: 'HomeSwiper',
  components: {
    GoodsCard
  },
  data() {
    return {
      swiperList: [],      // 轮播图数据
      categories: [],      // 分类数据
      activeCategory: null,    // 当前激活的一级分类
      activeSubCategory: null,  // 当前激活的二级分类
      goodsList: [],        // 商品列表数据
      loading: false        // 加载状态
    }
  },
  mounted() {
    this.loading = true
    Promise.all([
      this.getSwiperData(),
      this.getCategoryData(),
      this.getGoodsData()
    ]).finally(() => {
      this.loading = false
    })
  },
  methods: {
    async getSwiperData() {
      try {
        const res = await getCarouselList()
        if (res.code === 200) {
          this.swiperList = res.data.sort((a, b) => a.sort - b.sort)
        }
      } catch (error) {
        console.error('获取轮播图失败:', error)
      }
    },
    async getCategoryData() {
      try {
        const res = await getCategoryTree()
        if (res.code === 200) {
          this.categories = res.data
        }
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    },
    async getGoodsData() {
      try {
        const res = await getAllGoods()
        if (res && res.code === 200) {
          this.goodsList = res.data || []
        }
      } catch (error) {
        console.error('获取商品失败:', error)
      }
    },
    // 处理一级分类的悬浮
    handleCategoryHover(category) {
      if (category.children && category.children.length) {
        this.activeCategory = category
      }
    },
    // 处理一级分类的离开
    handleCategoryLeave() {
      this.activeCategory = null
      this.activeSubCategory = null
    },
    // 处理二级分类的悬浮
    handleSubCategoryHover(subCategory) {
      if (subCategory.children && subCategory.children.length) {
        this.activeSubCategory = subCategory
      }
    },
    // 处理二级分类的离开
    handleSubCategoryLeave() {
      this.activeSubCategory = null
    },
    // 处理分类点击
    handleCategoryClick(category) {
      // 阻止事件冒泡
      event.stopPropagation()
      // 跳转到商品列表页
      this.$router.push(`/goods/${category.id}`)
    },
    // 获取商品标签
    getGoodsTag(item) {
      if (item.status === 0) return '已下架'
      if (item.sales > 100) return '热销'
      if (item.isNew) return '新品'
      return ''
    },
    // 处理商品点击
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
    // 处理立即购买
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
/* 页面容器 */
.page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #fff5f5 0%, #fff8f8 100%);
}

/* 侧边装饰 */
.side-decoration {
  width: 100px;
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px 0;
}

.side-decoration.left {
  margin-right: 20px;
}

.side-decoration.right {
  margin-left: 20px;
}

.decoration-item {
  background: rgba(255, 255, 255, 0.9);
  padding: 15px 10px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.1);
  backdrop-filter: blur(10px);
}

.decoration-item:hover {
  transform: translateY(-3px);
  background: #fff;
  border-color: #ff4d4f;
  box-shadow: 0 4px 20px rgba(255, 77, 79, 0.2);
}

.decoration-item i {
  font-size: 24px;
  color: #ff4d4f;
  margin-bottom: 8px;
  display: block;
}

.decoration-item span {
  font-size: 14px;
  color: #ff4d4f;
  display: block;
  white-space: nowrap;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 添加新年装饰动画 */
.decoration-item i {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 添加喜庆背景 */
.swiper-section {
  display: flex;
  width: 100%;
  gap: 30px;
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #fff1f1 0%, #fff8f8 100%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(255, 77, 79, 0.1);
}

.swiper-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 10%, #ff4d4f10 1%, transparent 5%),
    radial-gradient(circle at 90% 20%, #ff4d4f10 1%, transparent 5%),
    radial-gradient(circle at 30% 80%, #ff4d4f10 1%, transparent 5%),
    radial-gradient(circle at 70% 90%, #ff4d4f10 1%, transparent 5%);
  border-radius: 12px;
  z-index: 0;
}

.category-sidebar {
  width: 240px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(255, 77, 79, 0.1);
  position: relative;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.category-item {
  position: relative;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
}

.category-item:hover {
  background: #fff0f0;
  color: #ff4d4f;
}

.category-item i {
  margin-right: 12px;
  color: #ff4d4f;
  font-size: 18px;
}

.category-item span {
  font-size: 15px;
}

.category-item .el-icon-arrow-right {
  margin-left: auto;
  opacity: 0;
  transition: all 0.3s;
}

.category-item:hover .el-icon-arrow-right {
  opacity: 1;
}

.swiper-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.home-swiper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(255, 77, 79, 0.15);
}

.swiper-link {
  position: relative;
  display: block;
  height: 100%;
}

.swiper-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #fff;
}

.swiper-info h3 {
  margin: 0;
  font-size: 18px;
}

.promo-cards {
  display: flex;
  gap: 15px;
  justify-content: space-between;
}

.promo-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(255, 77, 79, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 77, 79, 0.1);
}

.promo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(255, 77, 79, 0.2);
  border-color: rgba(255, 77, 79, 0.2);
}

.promo-card i {
  font-size: 28px;
  color: #ff4d4f;
  margin-bottom: 10px;
  display: block;
}

.promo-card span {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: 500;
}

/* 子菜单样式 */
.sub-categories, .third-categories {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(255, 77, 79, 0.15);
  backdrop-filter: blur(10px);
}

.sub-category:hover, .third-category:hover {
  background: #fff0f0;
  color: #ff4d4f;
}

/* 轮播图指示器样式 */
:deep(.el-carousel__indicators) {
  bottom: 20px;
}

:deep(.el-carousel__button) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(255, 77, 79, 0.3);
}

:deep(.el-carousel__indicator--active .el-carousel__button) {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

/* 添加多级菜单样式 */
.sub-categories {
  position: absolute;
  left: 100%;
  top: 0;
  width: 200px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sub-category {
  position: relative;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.third-categories {
  position: absolute;
  left: 100%;
  top: 0;
  width: 200px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 11;
}

.third-category {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
}

/* 商品展示区域 */
.goods-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(255, 77, 79, 0.1);
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
  position: relative;
  padding-left: 15px;
}

.section-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #ff4d4f;
  border-radius: 2px;
}

.loading-state, .empty-state {
  padding: 40px;
  text-align: center;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
</style> 