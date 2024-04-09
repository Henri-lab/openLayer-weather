<template>
  <div class="live">
    <div class="title">你正在预览{{ cityName }}的天气信息</div>
    <div class="info">
      <h1>当日气温是：{{ temperature }}摄氏度</h1>
      <h1>当日天气是：{{ weather }}</h1>
      <h1>当日风向是：{{ winddirection }}风</h1>
      <h1>当日风力是：{{ windpower }}级</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'
import { useSearchStore } from '@/stores/searchStore'

const route = useRoute()
const store = useWeatherInfoStore()
const store2 = useSearchStore()
const weather = ref('')
const temperature = ref('')
const winddirection = ref('')
const windpower = ref('')

// 对变量先ref后computed会出问题~~~
const adcode = computed(() => route.params.adcode)
const cityName = computed(() => route.params.cityName)
onMounted(() => {
  // 获取路由城市的天气信息
  store.getWeatherLiveInfo(adcode.value).then(() => {
    weather.value = store.weatherLive.weather
    temperature.value = store.weatherLive.temperature
    winddirection.value = store.weatherLive.winddirection
    windpower.value = store.weatherLive.windpower
    // 记录气温
    store2.setTemp(temperature.value)
  })
})
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 20px;
  line-height: 5px;
  text-align: center;
  background-color: rgba(0, 62, 90, 0.3);
  padding: 8px;
  color: rgb(232, 230, 227);
  font-size: 12px;
}
.live {
  display: flex;
  width: 100%;
  height: 150px;
  background-color: transparent;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 1px solid rgb(22, 26, 29);
  h1 {
    margin: 15px auto;
    text-align: center;
    background-color: transparent;
    color: rgb(232, 230, 227);
    font-size: 10px;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      'Open Sans',
      'Helvetica Neue',
      sans-serif;
    font-weight: lighter;
  }
}
</style>
