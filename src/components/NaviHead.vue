<template>
  <header class="navi-head">
    🌐
    <div class="title" @click="home">新中地天气</div>
    <div class="weather-summary">
      <div class="location">{{ local }}</div>
      <span class="lives"
        >实时天气：&nbsp; {{ weather }}&nbsp; {{ temperature }}°C&nbsp;&nbsp;
        {{ winddirection }}风{{ windpower }}级</span
      >
    </div>
    <div class="alert">
      <button class="btn" @click="alert">&nbsp;i&nbsp;</button>&nbsp;&nbsp;
      <button class="btn" @click="addCity" v-if="isShow">+</button>
    </div>
  </header>
</template>

<script setup>
import { ref, watchEffect, onMounted, computed } from 'vue'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'
import { useSearchStore } from '@/stores/searchStore'
import { useRouter, useRoute } from 'vue-router'
const store = useWeatherInfoStore()
const store2 = useSearchStore()
const router = useRouter()
const route = useRoute()
const local = ref('')
const adcode = ref('')
const weather = ref('')
const temperature = ref('')
const winddirection = ref('')
const windpower = ref('')
watchEffect(() => {
  local.value = store.local
  weather.value = store.weatherLive.weather
  temperature.value = store.weatherLive.temperature
  winddirection.value = store.weatherLive.winddirection
  windpower.value = store.weatherLive.windpower
})
onMounted(() => {
  console.log('头部组件调用')
  store.getLocalInfo().then(() => {
    console.log('头部组件调用')
    store.getCityAdcode(store.local).then(() => {
      console.log('头部组件调用')
      adcode.value = store.cityAdcode
      store.getWeatherLiveInfo(store.cityAdcode)
    })
  })
})
const home = () => {
  router.push({
    name: 'home'
    // query: {
    //   cityName: local.value
    // }
  })
  store.cityName = local.value
  store.cityAdcode = adcode.value
}
const isShow = computed(() => {
  if (route.meta.enabled) return true
  else return false
})
const addCity = () => {
  store2.add({
    cityName: route.params.cityName,
    temp: store2.temp
  })
  console.log('已经添加的城市名单：', store2.cityList)
  store2.setlocalStorage()
  console.log('已经更新localStorage')
}
const alert = () => {
  store2.dialogVisible = true
}
</script>

<style lang="scss" scoped>
.navi-head {
  width: 100%;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgba(0, 82, 110, 0.5);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  .title {
    height: 40px;
    line-height: 40px;
    color: #e8e6e3;
    font-size: 32px;
    position: absolute;
    // background-color: aqua;
    top: 50%;
    transform: translate(0, -50%);
    left: 300px;
  }
  .weather-summary {
    width: 280px;
    height: 40px;
    line-height: 40px;
    color: #e8e6e3;
    position: absolute;
    // background-color: red;
    top: 50%;
    transform: translate(0, -50%);
    left: 500px;
    .location {
      position: absolute;
      font-size: 16px;
      left: -15px;
      // background-color: burlywood;
    }
    .lives {
      position: absolute;
      font-size: 12px;
      left: 50px;
      // background-color: rgb(221, 135, 23);
    }
  }
  .alert {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: 300px;
    .btn {
      width: 25px;
      height: 25px;
      background-color: #e8e6e3;
      border: 0 solid;
      border-radius: 50%;
    }
    .btn:hover {
      color: green;
    }
  }
}
</style>

<!-- space：\u00A0 -->
