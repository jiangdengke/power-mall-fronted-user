<template>
  <el-card class="goods-card" shadow="hover" @click="handleClick">
    <!-- 商品主图 -->
    <div class="goods-img-wrapper">
      <img :src="goods.img" :alt="goods.name" class="goods-img">
      <div class="goods-tag" v-if="goods.tag">{{ goods.tag }}</div>
    </div>
    
    <!-- 商品信息 -->
    <div class="goods-info">
      <!-- 商品名称 -->
      <h3 class="goods-name" :title="goods.name">{{ goods.name }}</h3>
      
      <!-- 商品价格和按钮 -->
      <div class="goods-bottom">
        <div class="price-section">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ (goods.price / 100).toFixed(2) }}</span>
        </div>
        <el-button size="small" type="danger" round @click.stop="handleBuy">
          立即购买
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'GoodsCard',
  props: {
    goods: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        name: '',
        price: 0,
        img: ''
      })
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.goods)
    },
    handleBuy(event) {
      event.stopPropagation()
      this.$emit('buy', this.goods)
    }
  }
}
</script>

<style scoped>
.goods-card {
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  border-radius: 8px;
  overflow: hidden;
}

.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(255, 77, 79, 0.2) !important;
}

.goods-img-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 宽高比 */
  overflow: hidden;
}

.goods-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}

.goods-card:hover .goods-img {
  transform: scale(1.05);
}

.goods-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 2px 8px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

.goods-info {
  padding: 12px;
}

.goods-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #333;
}

.goods-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-symbol {
  color: #ff4d4f;
  font-size: 14px;
}

.price-value {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: bold;
}

/* 适配暗色主题 */
:deep(.el-card) {
  border: none;
  background: #fff;
}

:deep(.el-card__body) {
  padding: 0;
}
</style> 