<template>
  <div class="order-list">
    <div class="page-header">
      <h2>我的订单</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>我的订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 订单状态标签 -->
    <div class="status-tabs">
      <el-tabs v-model="activeStatus" @tab-click="handleStatusChange">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane label="待付款" name="1"></el-tab-pane>
        <el-tab-pane label="已完成" name="4"></el-tab-pane>
        <el-tab-pane label="已取消" name="5"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 空状态 -->
    <div v-else-if="!orderList.length" class="empty-state">
      <el-empty description="暂无订单">
        <el-button type="primary" @click="$router.push('/')">去购物</el-button>
      </el-empty>
    </div>

    <!-- 订单列表 -->
    <div v-else class="order-content">
      <div v-for="order in orderList" :key="order.id" class="order-item">
        <div class="order-header">
          <div class="order-info">
            <span class="order-time">{{ order.createTime }}</span>
            <span class="order-number">订单号：{{ order.orderSn }}</span>
          </div>
          <div class="order-status" :class="order.status">
            {{ getStatusText(order.status) }}
          </div>
        </div>

        <div class="order-goods">
          <el-table :data="order.orderItems" style="width: 100%">
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

        <div class="order-footer">
          <div class="order-amount">
            <span>实付金额：</span>
            <span class="price">¥{{ (order.payAmount / 100).toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <el-button 
              v-if="order.status === 1" 
              type="primary" 
              size="small"
              @click="handlePay(order)">
              立即付款
            </el-button>
            <el-button 
              v-if="order.status === 1" 
              type="danger" 
              size="small"
              @click="handleCancel(order)">
              取消订单
            </el-button>
            <el-button 
              v-if="order.status === 4" 
              type="primary" 
              size="small"
              @click="handleComment(order)">
              评价
            </el-button>
          </div>
        </div>
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
import { getOrderList, cancelOrder } from '@/api/oms'

export default {
  name: 'OrderList',
  data() {
    return {
      loading: false,
      activeStatus: '0',
      orderList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.fetchOrderList()
  },
  methods: {
    // 获取订单列表
    async fetchOrderList() {
      this.loading = true
      try {
        const res = await getOrderList()
        console.log('订单列表响应:', res)
        
        if (res.code === 200) {
          // 根据当前选中的状态过滤订单
          if (this.activeStatus === '0') {
            this.orderList = res.data
          } else {
            this.orderList = res.data.filter(order => order.status === parseInt(this.activeStatus))
          }
          this.total = this.orderList.length
        } else {
          this.$message.error(res.message || '获取订单列表失败')
          this.orderList = []
          this.total = 0
        }
      } catch (error) {
        console.error('获取订单列表失败:', error)
        this.$message.error('获取订单列表失败')
        this.orderList = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
    // 切换订单状态
    handleStatusChange() {
      this.currentPage = 1
      this.fetchOrderList()
    },
    // 切换页码
    handlePageChange(page) {
      this.currentPage = page
      this.fetchOrderList()
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        1: '待付款',
        2: '待发货',
        3: '已发货',
        4: '已完成',
        5: '已取消'
      }
      return statusMap[status] || '未知状态'
    },
    // 取消订单
    async handleCancel(order) {
      try {
        await this.$confirm('确定要取消该订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const res = await cancelOrder(order.orderSn)
        if (res.code === 200) {
          this.$message.success('订单取消成功')
          this.fetchOrderList()
        } else {
          this.$message.error(res.message || '取消订单失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          this.$message.error('取消订单失败')
        }
      }
    },
    // 立即付款
    handlePay(order) {
      this.$router.push(`/pay?orderId=${order.id}`)
    },
    // 评价
    handleComment(order) {
      // TODO: 实现评价功能
      this.$message.info(`订单 ${order.orderSn} 评价功能开发中...`)
    }
  }
}
</script>

<style scoped>
.order-list {
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

.status-tabs {
  background: #fff;
  padding: 0 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.loading-state, .empty-state {
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.order-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.order-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  gap: 20px;
  color: #666;
}

.order-status {
  font-weight: bold;
}

.order-goods {
  padding: 20px;
}

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

.order-footer {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-amount {
  font-size: 16px;
}

.order-amount .price {
  font-size: 20px;
  margin-left: 5px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style> 