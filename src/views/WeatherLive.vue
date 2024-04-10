<template>
  <div class="live">
    <div class="title" v-if="isShow">
      你正在预览{{ cityName }}的天气信息,可以通过通过右上角的"+"号按钮保存起来
    </div>
    <div class="title" v-else>你正在预览{{ cityName }}的天气信息</div>
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
const isShow = ref(true) //决定title的显示内容；@default:查看live城市不在cityList中

//查看城市的前提条件由route提供
const adcode = computed(() => route.params.adcode)
const cityName = computed(() => route.params.cityName)
//获得相关城市的天气live信息；@执行时间：添加按钮invoke之前
//将城市的temp和code同步store2,为添加城市至cityList提供支持
const getLive = async () => {
  // 获取城市的天气live信息
  store.getWeatherLiveInfo(adcode.value).then(() => {
    weather.value = store.weatherLive.weather
    temperature.value = store.weatherLive.temperature
    winddirection.value = store.weatherLive.winddirection
    windpower.value = store.weatherLive.windpower
    // 记录查看城市的气温
    store2.setTemp(temperature.value)
    // 记录查看城市的adcode
    store2.setAdcode(adcode.value)
  })
}

//检查cityList是否已经存在这个城市
const checkCityList = (city) => {
  return store2.isExist(city)
}

onMounted(async () => {
  await getLive()
  if (checkCityList(cityName.value)) {
    // 如果cityList已经存在查看live的城市
    isShow.value = false
  }else{
    isShow.value = true
  }
})
</script>

<style lang="scss" scoped>
.live {
  display: flex;
  width: 960px;
  height: 150px;
  margin: 0 auto;
  margin-top: 10px;
  background-color: transparent;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 1px solid rgb(22, 26, 29);
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
