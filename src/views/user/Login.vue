<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>用户登录</h2>
        <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
      </div>

      <!-- 登录方式切换 -->
      <div class="login-type">
        <el-radio-group v-model="loginType" size="medium">
          <el-radio-button label="password">密码登录</el-radio-button>
          <el-radio-button label="mail">邮箱登录</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 密码登录表单 -->
      <el-form v-if="loginType === 'password'" :model="loginForm" :rules="loginRules" ref="loginForm" label-width="80px">
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

      <!-- 邮箱登录表单 -->
      <el-form v-else :model="mailForm" :rules="mailRules" ref="mailForm" label-width="80px">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="mailForm.mail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="code-input">
            <el-input v-model="mailForm.code" placeholder="请输入验证码"></el-input>
            <el-button type="primary" :disabled="codeBtnDisabled" @click="handleSendCode">
              {{ codeButtonText }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitMailLogin" :loading="mailLoginLoading" class="submit-btn">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getEmailCode } from '@/api/ums'

export default {
  name: 'UserLogin',
  data() {
    return {
      loginType: 'password', // 登录方式：password-密码登录，mail-邮箱登录
      // 密码登录表单
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
      loginLoading: false,
      // 邮箱登录表单
      mailForm: {
        mail: '',
        code: ''
      },
      mailRules: {
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      mailLoginLoading: false,
      codeButtonText: '发送验证码',
      codeBtnDisabled: false,
      countdown: 60
    }
  },
  methods: {
    // 密码登录
    async submitLogin() {
      try {
        await this.$refs.loginForm.validate()
        this.loginLoading = true
        
        const success = await this.$store.dispatch('user/login', this.loginForm)
        
        if (success) {
          this.$message.success('登录成功')
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        } else {
          this.$message.error('用户名或密码错误')
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error('登录失败，请重试')
      } finally {
        this.loginLoading = false
      }
    },
    // 发送验证码
    async handleSendCode() {
      try {
        await this.$refs.mailForm.validateField('mail')
        if (!this.mailForm.mail) {
          this.$message.warning('请先输入邮箱')
          return
        }

        this.codeBtnDisabled = true
        const res = await getEmailCode(this.mailForm.mail)
        if (res.code === 200) {
          this.$message.success('验证码已发送到您的邮箱')
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
    // 邮箱登录
    async submitMailLogin() {
      try {
        await this.$refs.mailForm.validate()
        this.mailLoginLoading = true
        
        const success = await this.$store.dispatch('user/loginByMail', this.mailForm)
        
        if (success) {
          this.$message.success('登录成功')
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        } else {
          this.$message.error('验证码错误或已过期')
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error('登录失败，请重试')
      } finally {
        this.mailLoginLoading = false
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

.login-type {
  text-align: center;
  margin-bottom: 30px;
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