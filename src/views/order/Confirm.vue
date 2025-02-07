<template>
  <div class="order-confirm">
    <div class="page-header">
      <h2>确认订单</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>确认订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 订单内容 -->
    <div v-else class="order-content">
      <!-- 收货地址 -->
      <div class="section address-section">
        <h3 class="section-title">收货地址</h3>
        <div class="address-list">
          <div v-if="!orderInfo.address" class="empty-address">
            <el-button type="primary" size="small" @click="handleAddAddress">
              添加收货地址
            </el-button>
          </div>
          <div v-else class="address-item">
            <div class="address-info">
              <p>
                <span class="name">{{ orderInfo.address.name }}</span>
                <span class="phone">{{ orderInfo.address.phone }}</span>
              </p>
              <p class="address-detail">
                {{ orderInfo.address.province }}
                {{ orderInfo.address.city }}
                {{ orderInfo.address.district }}
                {{ orderInfo.address.detail }}
              </p>
            </div>
            <el-button type="text" @click="handleChangeAddress">更换地址</el-button>
          </div>
        </div>
      </div>

      <!-- 商品清单 -->
      <div class="section goods-section">
        <h3 class="section-title">商品清单</h3>
        <el-table :data="orderInfo.items" style="width: 100%">
          <el-table-column label="商品信息" min-width="400">
            <template slot-scope="scope">
              <div class="goods-info">
                <div class="goods-detail">
                  <div class="goods-name">{{ scope.row.spuName }}</div>
                  <div class="goods-spec">{{ scope.row.skuName }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="单价" width="120">
            <template slot-scope="scope">
              <span class="price">¥{{ (scope.row.price / 100).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="数量" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.count }}</span>
            </template>
          </el-table-column>

          <el-table-column label="小计" width="120">
            <template slot-scope="scope">
              <span class="subtotal">¥{{ ((scope.row.price * scope.row.count) / 100).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 订单备注 -->
      <div class="section remark-section">
        <h3 class="section-title">订单备注</h3>
        <el-input
          v-model="orderForm.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入订单备注（选填）">
        </el-input>
      </div>

      <!-- 订单金额 -->
      <div class="section amount-section">
        <div class="amount-item">
          <span>商品总额：</span>
          <span class="price">¥{{ (orderInfo.totalAmount / 100).toFixed(2) }}</span>
        </div>
        <div class="amount-item">
          <span>运费：</span>
          <span class="price">¥{{ (orderInfo.freightAmount / 100).toFixed(2) }}</span>
        </div>
        <div class="amount-item total">
          <span>应付总额：</span>
          <span class="price">¥{{ (orderInfo.payAmount / 100).toFixed(2) }}</span>
        </div>
      </div>

      <!-- 提交订单 -->
      <div class="submit-section">
        <div class="submit-info">
          <span>应付总额：</span>
          <span class="price">¥{{ (orderInfo.payAmount / 100).toFixed(2) }}</span>
        </div>
        <el-button 
          type="primary" 
          size="medium" 
          :loading="submitting"
          :disabled="!orderInfo.address"
          @click="handleSubmit">
          提交订单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { confirmOrder, confirmCartOrder, submitOrder } from '@/api/oms'

export default {
  name: 'OrderConfirm',
  data() {
    return {
      loading: false,
      submitting: false,
      orderInfo: {
        address: null,
        items: [],
        totalAmount: 0,
        freightAmount: 0,
        payAmount: 0
      },
      orderForm: {
        addressId: '',
        remark: ''
      }
    }
  },
  created() {
    this.fetchOrderInfo()
  },
  methods: {
    // 获取订单确认信息
    async fetchOrderInfo() {
      this.loading = true
      try {
        const { skuId, count } = this.$route.query
        let res
        if (skuId && count) {
          // 从商品详情页下单
          res = await confirmOrder(skuId, parseInt(count))
        } else {
          // 从购物车下单
          res = await confirmCartOrder()
        }
        
        if (res.code === 200) {
          this.orderInfo = res.data
          if (this.orderInfo.address) {
            this.orderForm.addressId = this.orderInfo.address.id
          }
        }
      } catch (error) {
        console.error('获取订单确认信息失败:', error)
        this.$message.error('获取订单确认信息失败')
      } finally {
        this.loading = false
      }
    },
    // 添加收货地址
    handleAddAddress() {
      // TODO: 实现添加地址功能
      this.$message.info('添加地址功能开发中...')
    },
    // 更换收货地址
    handleChangeAddress() {
      // TODO: 实现更换地址功能
      this.$message.info('更换地址功能开发中...')
    },
    // 提交订单
    async handleSubmit() {
      if (!this.orderForm.addressId) {
        this.$message.warning('请选择收货地址')
        return
      }

      try {
        this.submitting = true
        const res = await submitOrder(this.orderForm)
        if (res.code === 200) {
          this.$message.success('订单提交成功')
          // TODO: 跳转到支付页面
          this.$router.push('/pay')
        }
      } catch (error) {
        console.error('提交订单失败:', error)
        this.$message.error('提交订单失败')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.order-confirm {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.loading-state {
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.order-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #333;
}

/* 地址样式 */
.empty-address {
  text-align: center;
  padding: 20px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.address-info p {
  margin: 0;
}

.address-info .name {
  font-weight: bold;
  margin-right: 10px;
}

.address-info .phone {
  color: #666;
}

.address-detail {
  color: #666;
  margin-top: 5px;
}

/* 商品信息样式 */
.goods-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.goods-detail {
  flex: 1;
  min-width: 0;
}

.goods-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.goods-spec {
  font-size: 12px;
  color: #999;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
}

.subtotal {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 16px;
}

/* 金额信息样式 */
.amount-section {
  padding: 20px;
  text-align: right;
}

.amount-item {
  line-height: 2;
}

.amount-item.total {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

/* 提交订单栏 */
.submit-section {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  background: #f8f8f8;
}

.submit-info {
  font-size: 16px;
}

.submit-info .price {
  font-size: 20px;
  margin-left: 5px;
}
</style> 