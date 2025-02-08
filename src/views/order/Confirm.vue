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
          <el-button type="dashed" class="add-address" icon="el-icon-plus">
            添加收货地址
          </el-button>
        </div>
      </div>

      <!-- 商品清单 -->
      <div class="section goods-section">
        <h3 class="section-title">商品清单</h3>
        <el-table :data="orderInfo.orderItems" style="width: 100%">
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
              <span class="subtotal">¥{{ (scope.row.totalPrice / 100).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 支付方式 -->
      <div class="section payment-section">
        <h3 class="section-title">支付方式</h3>
        <el-radio-group v-model="payType">
          <el-radio :label="1">
            <i class="el-icon-money"></i> 微信支付
          </el-radio>
          <el-radio :label="2">
            <i class="el-icon-wallet"></i> 支付宝支付
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 订单金额 -->
      <div class="section amount-section">
        <div class="amount-item">
          <span>商品总额：</span>
          <span class="price">¥{{ (orderInfo.totalAmount / 100).toFixed(2) }}</span>
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
      payType: 1, // 默认微信支付
      orderInfo: {
        orderItems: [],
        totalAmount: 0,
        payAmount: 0
      },
      orderForm: {}
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
        }
      } catch (error) {
        console.error('获取订单确认信息失败:', error)
        this.$message.error('获取订单确认信息失败')
      } finally {
        this.loading = false
      }
    },
    // 提交订单
    async handleSubmit() {
      if (!this.payType) {
        this.$message.warning('请选择支付方式')
        return
      }

      try {
        this.submitting = true
        // 构造订单提交表单
        const orderForm = {
          orderSn: this.orderInfo.orderSn,
          remark: '',  // 订单备注
          payType: this.payType,  // 使用选择的支付方式
          totalAmount: this.orderInfo.totalAmount,
          payAmount: this.orderInfo.payAmount,
          orderItems: this.orderInfo.orderItems.map(item => ({
            skuId: item.skuId,
            price: item.price,
            count: item.count
          }))
        }
        
        console.log('提交的订单数据：', orderForm)
        const res = await submitOrder(orderForm)
        
        if (res.code === 200) {
          this.$message.success('订单提交成功')
          // 跳转到待付款订单页面
          this.$router.push({
            path: '/orders',
            query: { status: '1' }  // 1表示待付款状态
          })
        } else {
          this.$message.error(res.message || '提交订单失败')
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

.payment-section {
  padding: 20px;
}

.payment-section .el-radio {
  margin-right: 30px;
  display: inline-flex;
  align-items: center;
}

.payment-section .el-radio i {
  margin-right: 5px;
  font-size: 18px;
}

.el-radio.is-checked i {
  color: #409EFF;
}

/* 收货地址样式 */
.address-section {
  padding: 20px;
}

.address-list {
  min-height: 120px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.add-address {
  width: 240px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.add-address:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.add-address i {
  font-size: 24px;
  margin-bottom: 8px;
}
</style> 