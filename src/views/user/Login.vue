<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>用户登录</h2>
        <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLogin" :loading="loginLoading" class="submit-btn">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loginLoading: false
    }
  },
  methods: {
    async submitLogin() {
      try {
        await this.$refs.loginForm.validate()
        this.loginLoading = true
        
        // 调用登录接口
        const success = await this.$store.dispatch('user/login', this.loginForm)
        
        if (success) {
          this.$message.success('登录成功')
          this.$router.push('/')
        } else {
          this.$message.error('用户名或密码错误')
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error('登录失败，请重试')
      } finally {
        this.loginLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.login-header p {
  margin: 0;
  color: #666;
}

.login-header a {
  color: #ff4d4f;
  text-decoration: none;
}

.submit-btn {
  width: 100%;
}
</style> 