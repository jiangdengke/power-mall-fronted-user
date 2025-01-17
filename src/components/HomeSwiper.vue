<template>
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
                   :key="thirdItem.id">
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
</template>

<script>
import { getCarouselList } from '@/api/cms'
import { getCategoryTree } from '@/api/pms'

export default {
  name: 'HomeSwiper',
  data() {
    return {
      swiperList: [],      // 轮播图数据
      categories: [],      // 分类数据
      activeCategory: null,    // 当前激活的一级分类
      activeSubCategory: null  // 当前激活的二级分类
    }
  },
  created() {
    this.getSwiperData()
    this.getCategoryData()
  },
  methods: {
    async getSwiperData() {
      try {
        const res = await getCarouselList()
        if (res.code === 200) {
          this.swiperList = res.data.sort((a, b) => a.sort - b.sort)
        } else {
          this.$message.error(res.message || '获取轮播图数据失败')
        }
      } catch (error) {
        this.$message.error('获取轮播图数据出错')
      }
    },
    async getCategoryData() {
      try {
        const res = await getCategoryTree()
        if (res.code === 200) {
          this.categories = res.data
        } else {
          this.$message.error(res.message || '获取分类数据失败')
        }
      } catch (error) {
        this.$message.error('获取分类数据出错')
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
    }
  }
}
</script>

<style scoped>
.swiper-section {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
}

.category-sidebar {
  width: 200px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.category-item {
  position: relative;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background: #f5f7fa;
  color: #409EFF;
}

.category-item i {
  margin-right: 8px;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.home-swiper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.promo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.promo-card i {
  font-size: 24px;
  color: #409EFF;
  margin-bottom: 8px;
  display: block;
}

.promo-card span {
  color: #606266;
  font-size: 14px;
}

/* 自定义轮播图指示器样式 */
:deep(.el-carousel__indicators) {
  bottom: 16px;
}

:deep(.el-carousel__button) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
}

:deep(.el-carousel__indicator--active .el-carousel__button) {
  background-color: #409EFF;
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

.sub-category:hover {
  background: #f5f7fa;
  color: #409EFF;
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

.third-category:hover {
  background: #f5f7fa;
  color: #409EFF;
}
</style> 