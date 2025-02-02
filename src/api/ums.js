import request from '@/utils/request'

// 用户名密码注册
export function register(data) {
  return request({
    url: '/api/ums/registerByPassword',
    method: 'post',
    data
  })
}

// 获取邮箱验证码
export function getEmailCode(email) {
  return request({
    url: '/api/ums/getCodeByMail',
    method: 'get',
    params: {
      mail: email
    }
  })
}

// 用户登录
export function login(data) {
  return request({
    url: '/api/ums/loginByUsername',
    method: 'post',
    params: {
      username: data.username,
      password: data.password
    }
  })
} 