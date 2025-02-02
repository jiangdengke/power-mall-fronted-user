<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h2>用户注册</h2>
        <p>已有账号？<router-link to="/login">立即登录</router-link></p>
      </div>
      
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="code-input">
            <el-input v-model="registerForm.code" placeholder="请输入验证码"></el-input>
            <el-button type="primary" :disabled="codeBtnDisabled" @click="handleSendCode">
              {{ codeButtonText }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRegister" :loading="registerLoading" class="submit-btn">
            注 册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { register, getEmailCode } from '@/api/ums'

export default {
  name: 'UserRegister',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        email: '',
        code: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 30, message: '用户名长度应在3到30个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度应至少为6个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      registerLoading: false,
      codeButtonText: '发送验证码',
      codeBtnDisabled: false,
      countdown: 60
    }
  },
  methods: {
    // 发送验证码
    async handleSendCode() {
      try {
        // 验证邮箱
        await this.$refs.registerForm.validateField('email')
        if (!this.registerForm.email) {
          this.$message.warning('请先输入邮箱')
          return
        }

        this.codeBtnDisabled = true
        // 调用发送验证码接口
        const res = await getEmailCode(this.registerForm.email)
        if (res.code === 200) {
          this.$message.success('验证码已发送到您的邮箱')
          // 开始倒计时
          this.countdown = 60
          const timer = setInterval(() => {
            if (this.countdown > 0) {
              this.countdown--
              this.codeButtonText = `${this.countdown}秒后重试`
            } else {
              clearInterval(timer)
              this.codeBtnDisabled = false
              this.codeButtonText = '发送验证码'
            }
          }, 1000)
        } else {
          this.$message.error(res.message || '验证码发送失败')
          this.codeBtnDisabled = false
        }
      } catch (error) {
        console.error('发送验证码失败:', error)
        this.$message.error('发送验证码失败，请重试')
        this.codeBtnDisabled = false
      }
    },
    // 提交注册
    async submitRegister() {
      try {
        // 表单验证
        await this.$refs.registerForm.validate()
        
        // 显示加载状态
        this.registerLoading = true
        
        // 调用注册接口
        const res = await register(this.registerForm)
        console.log('注册响应:', res)
        
        // 注册成功
        this.$message.success('注册成功')
        // 跳转到登录页
        this.$router.push('/login')
      } catch (error) {
        // 显示具体错误信息
        console.error('注册失败:', error)
        this.$message.error(error.message || '注册失败，请重试')
      } finally {
        this.registerLoading = false
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.register-header p {
  margin: 0;
  color: #666;
}

.register-header a {
  color: #ff4d4f;
  text-decoration: none;
}

.code-input {
  display: flex;
  gap: 10px;
}

.code-input .el-input {
  flex: 1;
}

.code-input .el-button {
  width: 120px;
}

.submit-btn {
  width: 100%;
}
</style> 