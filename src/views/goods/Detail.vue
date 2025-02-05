<template>
  <div class="goods-detail">
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 商品详情内容 -->
    <div v-else-if="goods" class="detail-content">
      <div class="detail-left">
        <!-- 商品主图 -->
        <div class="goods-gallery">
          <img :src="goods.img" :alt="goods.name" class="main-img">
          <!-- 商品图集 -->
          <div class="img-list" v-if="goods.imgList && goods.imgList.length">
            <img 
              v-for="(img, index) in goods.imgList" 
              :key="index"
              :src="img"
              :class="['thumb-img', { active: currentImg === img }]"
              @click="currentImg = img"
            >
          </div>
        </div>
      </div>

      <div class="detail-right">
        <!-- 商品信息 -->
        <h1 class="goods-name">{{ goods.name }}</h1>
        <div class="goods-category">{{ goods.categoryName }}</div>
        
        <div class="goods-price">
          <span class="price-label">价格</span>
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ (goods.price / 100).toFixed(2) }}</span>
        </div>

        <div class="goods-sales">
          <span>销量: {{ goods.sales }}</span>
          <span class="stock">库存: {{ goods.totalStock }}</span>
        </div>

        <!-- 商品规格 -->
        <div class="goods-specs" v-if="goods.skuList && goods.skuList.length">
          <div v-for="spec in processedSpecs" :key="spec.specId" class="spec-item">
            <div class="spec-label">
              <span class="spec-name">{{ spec.specName }}</span>
            </div>
            <div class="spec-values">
              <div 
                v-for="value in spec.values" 
                :key="value.specValueId"
                :class="[
                  'spec-value-item', 
                  { 
                    active: selectedSpecs[spec.specId] === value.specValueId,
                    disabled: !isSpecValueAvailable(spec.specId, value.specValueId)
                  }
                ]"
                @click="handleSpecSelect(spec.specId, value.specValueId)">
                {{ value.specValue }}
              </div>
            </div>
          </div>
        </div>

        <!-- SKU 信息 -->
        <div class="sku-info" v-if="currentSku">
          <div class="sku-price">
            <span class="price-label">选择规格价格</span>
            <span class="price-symbol">¥</span>
            <span class="price-value">{{ (currentSku.price / 100).toFixed(2) }}</span>
          </div>
          <div class="sku-stock">
            库存: {{ currentSku.stock }}
          </div>
          <div class="sku-name">规格: {{ currentSku.name }}</div>
        </div>

        <!-- 在商品规格后面添加数量选择 -->
        <div class="goods-count" v-if="currentSku">
          <div class="count-label">数量</div>
          <el-input-number 
            v-model="buyCount"
            :min="1"
            :max="currentSku.stock"
            @change="handleCountChange">
          </el-input-number>
        </div>

        <!-- 修改购买按钮部分 -->
        <div class="action-buttons">
          <el-button 
            type="danger" 
            size="large" 
            :disabled="!canBuy" 
            @click="handleBuy">
            {{ getBuyButtonText }}
          </el-button>
          <el-button 
            type="primary" 
            size="large" 
            :disabled="!canBuy"
            :loading="addCartLoading" 
            @click="handleAddToCart">
            加入购物车
          </el-button>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div v-if="goods" class="goods-info">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品详情" name="detail">
          <div class="detail-content" v-html="goods.detail"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getGoodsDetail, addToCart } from '@/api/pms'

export default {
  name: 'GoodsDetail',
  data() {
    return {
      loading: false,
      goods: null,
      currentImg: '',
      activeTab: 'detail',
      selectedSpecs: {},  // 已选择的规格 { specId: specValueId }
      currentSku: null,   // 当前选中的SKU
      buyCount: 1,        // 购买数量
      addCartLoading: false  // 添加购物车loading状态
    }
  },
  computed: {
    // 处理规格数据
    processedSpecs() {
      if (!this.goods || !this.goods.skuList) return []
      
      // 用于存储所有规格及其值
      const specsMap = new Map()
      
      // 遍历所有SKU的规格值列表
      this.goods.skuList.forEach(sku => {
        if (!sku.specValueList) return
        
        sku.specValueList.forEach(spec => {
          if (!specsMap.has(spec.specId)) {
            specsMap.set(spec.specId, {
              specId: spec.specId,
              specName: spec.specName,
              values: new Map()
            })
          }
          
          // 将规格值添加到对应规格的values中
          specsMap.get(spec.specId).values.set(spec.specValueId, {
            specValueId: spec.specValueId,
            specValue: spec.specValue
          })
        })
      })
      
      // 转换为数组格式
      return Array.from(specsMap.values()).map(spec => ({
        ...spec,
        values: Array.from(spec.values.values())
      }))
    },

    // 获取可选的规格值
    availableSpecValues() {
      if (!this.goods || !this.goods.skuList) return {}

      const result = {}
      const selectedSpecIds = Object.keys(this.selectedSpecs)

      // 遍历每个规格
      this.processedSpecs.forEach(spec => {
        const specId = spec.specId.toString()
        result[specId] = new Set()

        // 遍历所有SKU，找出符合当前已选规格的SKU
        this.goods.skuList.forEach(sku => {
          // 检查当前SKU是否满足已选规格的条件
          const isMatch = selectedSpecIds.every(selectedSpecId => {
            if (selectedSpecId === specId) return true // 跳过当前正在处理的规格
            const specValue = sku.specValueList.find(sv => sv.specId.toString() === selectedSpecId)
            return specValue && specValue.specValueId === this.selectedSpecs[selectedSpecId]
          })

          // 如果满足条件，将该SKU的对应规格值添加到可选集合中
          if (isMatch) {
            const specValue = sku.specValueList.find(sv => sv.specId.toString() === specId)
            if (specValue) {
              result[specId].add(specValue.specValueId)
            }
          }
        })
      })

      return result
    },
    // 判断是否可以购买
    canBuy() {
      return this.goods && 
             this.goods.status === 1 && 
             this.currentSku && 
             this.currentSku.status === 1 &&
             this.currentSku.stock > 0
    },
    // 购买按钮文本
    getBuyButtonText() {
      if (!this.goods) return '加载中'
      if (this.goods.status === 0) return '已下架'
      if (!this.currentSku) return '请选择规格'
      if (this.currentSku.status === 0) return '该规格已下架'
      if (this.currentSku.stock <= 0) return '库存不足'
      return '立即购买'
    }
  },
  watch: {
    // 监听规格选择变化
    selectedSpecs: {
      handler() {
        this.updateCurrentSku()
      },
      deep: true
    }
  },
  created() {
    this.fetchGoodsDetail()
  },
  methods: {
    async fetchGoodsDetail() {
      const id = this.$route.params.id
      if (!id) return
      
      this.loading = true
      try {
        const res = await getGoodsDetail(id)
        console.log('商品详情数据:', res)
        if (res.code === 200) {
          this.goods = res.data
          this.currentImg = this.goods.img
          // 不需要初始化selectedSpecs，用户需要主动选择规格
          this.selectedSpecs = {}
        }
      } catch (error) {
        console.error('获取商品详情失败:', error)
        this.$message.error('获取商品详情失败')
      } finally {
        this.loading = false
      }
    },
    // 更新当前选中的SKU
    updateCurrentSku() {
      if (!this.goods || !this.goods.skuList) return

      // 检查是否所有规格都已选择
      const selectedSpecIds = Object.keys(this.selectedSpecs)
      const allSpecsSelected = this.processedSpecs.every(spec => 
        selectedSpecIds.includes(spec.specId.toString())
      )

      if (!allSpecsSelected) {
        this.currentSku = null
        return
      }

      // 查找匹配的SKU
      this.currentSku = this.goods.skuList.find(sku => {
        return sku.specValueList.every(spec => 
          this.selectedSpecs[spec.specId] === spec.specValueId
        )
      })
    },
    handleBuy() {
      if (!this.canBuy) return
      if (!this.currentSku) {
        this.$message.warning('请选择商品规格')
        return
      }
      // TODO: 实现购买逻辑
      this.$message.success('购买功能开发中...')
    },
    // 添加到购物车
    async handleAddToCart() {
      if (!this.canBuy) return
      if (!this.currentSku) {
        this.$message.warning('请选择商品规格')
        return
      }

      try {
        this.addCartLoading = true
        const res = await addToCart(this.currentSku.id, this.buyCount)
        if (res.code === 200) {
          this.$message({
            message: '成功加入购物车',
            type: 'success'
          })
        } else {
          this.$message.error(res.message || '加入购物车失败')
        }
      } catch (error) {
        console.error('加入购物车失败:', error)
        this.$message.error('加入购物车失败，请重试')
      } finally {
        this.addCartLoading = false
      }
    },
    handleSpecSelect(specId, specValueId) {
      // 如果规格值不可选，直接返回
      if (!this.isSpecValueAvailable(specId, specValueId)) return

      // 如果是取消选择
      if (this.selectedSpecs[specId] === specValueId) {
        this.$delete(this.selectedSpecs, specId)
      } else {
        this.$set(this.selectedSpecs, specId, specValueId)
      }
      this.updateCurrentSku()
    },
    // 判断规格值是否可选
    isSpecValueAvailable(specId, specValueId) {
      const availableValues = this.availableSpecValues[specId]
      if (!availableValues) return true // 如果还没有选择任何规格，所有值都可选
      return availableValues.has(specValueId)
    },
    // 修改购买数量
    handleCountChange(value) {
      this.buyCount = value
    }
  }
}
</script>

<style scoped>
.goods-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.loading-state {
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.detail-content {
  display: flex;
  gap: 40px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.detail-left {
  flex: 1;
  max-width: 500px;
}

.detail-right {
  flex: 1;
  padding: 20px;
}

.goods-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.img-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.thumb-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.thumb-img.active {
  border-color: #ff4d4f;
}

.goods-name {
  font-size: 24px;
  margin: 0 0 10px 0;
  color: #333;
}

.goods-category {
  color: #666;
  margin-bottom: 20px;
}

.goods-price {
  margin: 20px 0;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.price-label {
  font-size: 14px;
  color: #999;
}

.price-symbol {
  color: #ff4d4f;
  font-size: 16px;
}

.price-value {
  color: #ff4d4f;
  font-size: 28px;
  font-weight: bold;
}

.goods-sales {
  margin: 20px 0;
  color: #666;
  display: flex;
  gap: 20px;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  gap: 20px;
}

.goods-info {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.detail-content {
  padding: 20px 0;
}

/* 规格选择样式 */
.goods-specs {
  margin: 20px 0;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.spec-item {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
}

.spec-label {
  width: 60px;
  margin-right: 10px;
  flex-shrink: 0;
}

.spec-name {
  font-size: 14px;
  color: #999;
  line-height: 32px;
}

.spec-values {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.spec-value-item {
  min-width: 40px;
  height: 32px;
  line-height: 30px;
  padding: 0 15px;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  position: relative;
  background: #fff;
  transition: all 0.3s;
  user-select: none;
}

.spec-value-item:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.spec-value-item.active {
  border-color: #ff4d4f;
  color: #ff4d4f;
  background: #fff8f8;
}

.spec-value-item.active::after {
  content: '';
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 12px 12px;
  border-color: transparent transparent #ff4d4f transparent;
}

.spec-value-item.disabled {
  cursor: not-allowed;
  color: #ccc;
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.spec-value-item.disabled:hover {
  border-color: #e0e0e0;
  color: #ccc;
}

/* SKU信息样式 */
.sku-info {
  margin: 20px 0;
  padding: 15px;
  background: #fff8f8;
  border-radius: 8px;
  border: 1px solid #ffebeb;
}

.sku-price {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 10px;
}

.sku-stock {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.sku-name {
  color: #666;
  font-size: 14px;
  padding-top: 5px;
  border-top: 1px dashed #e0e0e0;
  margin-top: 5px;
}

/* 禁用状态的按钮样式 */
:deep(.el-button.is-disabled) {
  background-color: #f5f5f5;
  border-color: #dcdfe6;
  color: #999;
}

.goods-count {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.count-label {
  font-size: 14px;
  color: #999;
  width: 60px;
}

:deep(.el-input-number) {
  width: 150px;
}
</style> 