<template>
  <div class="swiper-section">
    <div class="category-sidebar">
      <div class="category-item" v-for="(item, index) in categories" :key="index">
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
        <i class="el-icon-arrow-right"></i>
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
export default {
  name: 'HomeSwiper',
  data() {
    return {
      swiperList: [],
      categories: [
        { name: '手机数码', icon: 'el-icon-mobile-phone' },
        { name: '电脑办公', icon: 'el-icon-notebook-2' },
        { name: '家用电器', icon: 'el-icon-refrigerator' },
        { name: '服装鞋包', icon: 'el-icon-shopping-bag-1' },
        { name: '美妆护肤', icon: 'el-icon-cherry' },
        { name: '食品生鲜', icon: 'el-icon-food' },
        { name: '图书音像', icon: 'el-icon-reading' },
        { name: '运动户外', icon: 'el-icon-basketball' }
      ]
    }
  },
  created() {
    this.getSwiperData()
  },
  methods: {
    async getSwiperData() {
      try {
        const response = await this.$http.get('/swiper')
        if (response.data.code === 200) {
          this.swiperList = response.data.data
        } else {
          this.$message.error('获取轮播图数据失败')
        }
      } catch (error) {
        console.error('获取轮播图数据出错:', error)
        this.$message.error('获取轮播图数据出错')
      }
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
}

.category-item {
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
</style> 