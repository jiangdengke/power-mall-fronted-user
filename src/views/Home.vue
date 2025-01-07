<template>
  <div class="home">
    <home-swiper></home-swiper>
    <!-- 其他首页内容可以在这里添加 -->
  </div>
</template>

<script>
import HomeSwiper from '@/components/HomeSwiper.vue'

export default {
  name: 'HomePage',
  components: {
    HomeSwiper
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
}
</style> 