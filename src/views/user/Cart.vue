<template>
  <div class="cart-page">
    <div class="page-header">
      <h2>我的购物车</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>购物车</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 空购物车 -->
    <div v-else-if="!cartList.length" class="empty-state">
      <el-empty description="购物车是空的">
        <el-button type="primary" @click="$router.push('/')">去购物</el-button>
      </el-empty>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-content">
      <el-table
        ref="cartTable"
        :data="cartList"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        
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
            <div class="original-price" v-if="scope.row.originalPrice > scope.row.price">
              ¥{{ (scope.row.originalPrice / 100).toFixed(2) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="数量" width="200">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.count"
              :min="1"
              :max="scope.row.stock"
              size="small"
              @change="value => handleCountChange(scope.row, value)">
            </el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="小计" width="120">
          <template slot-scope="scope">
            <span class="subtotal">¥{{ ((scope.row.price * scope.row.count) / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="delete-btn"
              @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部结算栏 -->
      <div class="cart-footer">
        <div class="left">
          <el-checkbox
            v-model="isAllSelected"
            @change="handleSelectAll">
            全选
          </el-checkbox>
          <el-button type="text" class="delete-btn" @click="handleBatchDelete">
            删除选中商品
          </el-button>
        </div>
        <div class="right">
          <div class="total-info">
            <span>已选择 {{ selectedCount }} 件商品</span>
            <span class="total">
              合计：<span class="price">¥{{ (totalPrice / 100).toFixed(2) }}</span>
            </span>
          </div>
          <el-button
            type="primary"
            size="medium"
            :disabled="!selectedCount"
            @click="handleCheckout">
            结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCartList } from '@/api/pms'

export default {
  name: 'UserCart',
  data() {
    return {
      loading: false,
      cartList: [],
      selectedItems: []
    }
  },
  computed: {
    // 总价
    totalPrice() {
      return this.selectedItems.reduce((total, item) => {
        return total + item.price * item.count
      }, 0)
    },
    // 选中的商品数量
    selectedCount() {
      return this.selectedItems.length
    },
    // 是否全选
    isAllSelected: {
      get() {
        return this.cartList.length === this.selectedItems.length
      },
      set() {
        // 在handleSelectAll中处理
      }
    }
  },
  created() {
    this.fetchCartList()
  },
  methods: {
    // 获取购物车列表
    async fetchCartList() {
      this.loading = true
      try {
        const res = await getCartList()
        if (res.code === 200) {
          this.cartList = res.data
          this.selectedItems = [...this.cartList]  // 先设置选中项
          
          // 等待下一个渲染周期
          this.$nextTick(() => {
            if (this.$refs.cartTable) {
              // 设置表格选中状态
              this.cartList.forEach(item => {
                this.$refs.cartTable.toggleRowSelection(item, true)
              })
            }
          })
        } else {
          this.$message.error(res.message || '获取购物车列表失败')
        }
      } catch (error) {
        console.error('获取购物车列表失败:', error)
        this.$message.error('获取购物车列表失败')
      } finally {
        this.loading = false
      }
    },
    // 选择商品变化
    handleSelectionChange(val) {
      this.selectedItems = [...val]
    },
    // 全选/取消全选
    handleSelectAll(val) {
      if (val) {
        this.$refs.cartTable.toggleAllSelection()
      } else {
        this.$refs.cartTable.clearSelection()
      }
    },
    // 修改商品数量
    async handleCountChange(item, value) {
      // TODO: 调用修改数量接口
      console.log('修改数量:', item.skuId, value)
      try {
        // 更新 cartList 中的数量
        const cartItem = this.cartList.find(i => i.skuId === item.skuId)
        if (cartItem) {
          cartItem.count = value
        }
        
        // 更新选中状态
        this.$refs.cartTable.toggleRowSelection(item, false)
        this.$refs.cartTable.toggleRowSelection(item, true)

        // 这里添加调用后端接口的逻辑
        // const res = await updateCartItemCount(item.skuId, value)
        // if (res.code === 200) {
        //   this.$message.success('修改数量成功')
        //   await this.fetchCartList()
        // }
      } catch (error) {
        console.error('修改数量失败:', error)
        this.$message.error('修改数量失败')
      }
    },
    // 删除单个商品
    async handleDelete(item) {
      try {
        await this.$confirm('确定要删除该商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用删除接口
        console.log('删除商品:', item.skuId)
        // const res = await deleteCartItem(item.skuId)
        // if (res.code === 200) {
        //   this.$message.success('删除成功')
        //   await this.fetchCartList()
        // }
        this.$message.success('删除成功')
        await this.fetchCartList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    },
    // 批量删除
    async handleBatchDelete() {
      if (!this.selectedItems.length) {
        this.$message.warning('请选择要删除的商品')
        return
      }
      
      try {
        await this.$confirm(`确定要删除这 ${this.selectedItems.length} 件商品吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // TODO: 调用批量删除接口
        const skuIds = this.selectedItems.map(item => item.skuId)
        console.log('批量删除商品:', skuIds)
        // const res = await batchDeleteCartItems(skuIds)
        // if (res.code === 200) {
        //   this.$message.success('删除成功')
        //   await this.fetchCartList()
        // }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('批量删除失败:', error)
          this.$message.error('批量删除失败')
        }
      }
    },
    // 结算
    handleCheckout() {
      if (!this.selectedItems.length) {
        this.$message.warning('请选择要结算的商品')
        return
      }
      // TODO: 跳转到结算页面
      this.$message.info('结算功能开发中...')
    }
  }
}
</script>

<style scoped>
.cart-page {
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

.loading-state, .empty-state {
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.cart-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.goods-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.goods-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.goods-detail {
  flex: 1;
  min-width: 0;
}

.goods-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.4;
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

.delete-btn {
  color: #ff4d4f;
}

.delete-btn:hover {
  color: #ff7875;
}

.cart-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  text-align: right;
}

.total-info > span {
  display: block;
  line-height: 1.6;
}

.total-info .total {
  font-size: 16px;
  font-weight: bold;
}

.total-info .price {
  font-size: 20px;
  margin-left: 5px;
}

.original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}
</style> 