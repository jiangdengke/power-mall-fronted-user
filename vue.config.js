const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/',
  assetsDir: 'static',
  devServer: {
    historyApiFallback: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8888',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/api": "/api",
    //     }
    //   }
    // }
    proxy: { //设置代理，必须填
      '/api': { //设置拦截器 拦截器格式 斜杠+拦截器名字，名字可
        target: 'http://localhost:8888', // 代 理 的 目 标 地 址 , 就 是 /api 代 替
        changeOrigin: true, //是否设置同源，输入是的
        pathRewrite: { //路径重写
          '/api': '' //选择忽略拦截器里面的单词
        }}}
   },
})
