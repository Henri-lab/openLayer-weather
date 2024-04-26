<template>
  <div class="container">
    <header class="navi-head">
      <img class="pic1" src="../img/天气预报 (1).png" @click="home" />
      <div class="title" @click="home">新中地天气</div>
      <div class="weather-summary">
        <div class="location">{{ local }}</div>
        <span class="lives"
          >实时天气：&nbsp; {{ weather }}&nbsp; {{ temperature }}°C&nbsp;&nbsp;
          {{ winddirection }}风{{ windpower }}级</span
        >
      </div>
      <div class="alert">
        <el-button class="btn btn-i" @click="pop" circle size="small"
          ><img class="pic2" src="../img/i.png" /></el-button
        >&nbsp;&nbsp;
        <div class="btn btn2" circle size="small" v-if="isShow" @click.stop="addCity">
          <img class="pic3" src="../img/+.png" />
        </div>
      </div>
    </header>
  </div>
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
const record =
  'weather项目开发日志(JS:Vue3+Router+Pinia)@总结：越写越觉得问题比较多，现在问题仍旧有很多☢@更新:在头部组件的isShow判断条件。解决了进入已添加城市的live组件时，添加键仍然挂载的问@更新:在头部组件中返回home路由的操作内容@更新：在WeatherPredictionVue中的loadData阶段增加了对于页面的判断，在数据来源方面增加了路由。解决了天气预报加载时机过早的问题@更新：对页面布局的颜色和布局重新设计。解决无效占位和色彩显示的问题；*色彩显示主要是之前开了DARK主题插件导致的~@更新：本地储存城市列表时，同时储存城市adcode方便使用@更新：修复了输入城市时显示没有样式的问题 '
watchEffect(() => {
  local.value = store.local
  weather.value = store.weatherLive.weather
  temperature.value = store.weatherLive.temperature
  winddirection.value = store.weatherLive.winddirection
  windpower.value = store.weatherLive.windpower
})

//引起❌:
// const requestLive = async () => {
//   console.log('头部组件调用')
//   store.getLocalInfo().then(() => {
//     console.log('头部组件调用')
//     store.getCityAdcode(store.local).then(() => {
//       console.log('头部组件调用')
//       adcode.value = store.cityAdcode
//       store.getWeatherLiveInfo(store.cityAdcode)
//     })
//   })
// }
const requestLive = async () => {
  console.log('头部组件调用')
  await store.getLocalInfo()
  console.log('头部组件调用')
  await store.getCityAdcode(store.local)
  console.log('头部组件调用')
  adcode.value = store.cityAdcode
  await store.getWeatherLiveInfo(store.cityAdcode)
}

onMounted(async () => {
  console.log(record.split('@'))
  let count = 0
  console.log('本地实时天气-首次请求')
  await requestLive()
  // 记录本地的adcode，方便后续使用
  store.localCode = adcode.value
  // 每5分钟请求一次
  setInterval(async () => {
    count++
    console.log(`本地实时天气-第${count}次请求`)
    await requestLive()
    store.localCode = adcode.value
  }, 300000)
})

const home = () => {
  router.back()
  //store1中的记录只在查询后更新；
  //因此返回至home时手动更新store1中的状态，确保显示的页面城市与store1保持同步
  store.cityName = local.value
  store.cityAdcode = adcode.value
  // 改变首次添加
  store2.isfirst = 0
}

//添加按钮的显示
const isShow = computed(() => {
  // 标记：-设置路径的元数据-提供支持
  // 如果你去的是live路由，并且你查看live的城市不在cityList中，添加添加键显示；
  if (route.meta.enabled && !store2.isExist(route.params.cityName)) return true
  // 如果你去的是live路由，并且你查看live的城市在cityList中，但是是首次添加，添加添加键显示；
  else if (store2.isExist(route.params.cityName) && store2.isfirst) return true
  else return false
})

const addCity = () => {
  store2.add({
    cityName: route.params.cityName,
    temp: store2.temp,
    adcode: store.cityAdcode
  })
  // 声明为首次添加
  store2.isfirst = 1

  console.log('已经添加的城市名单：', store2.cityList)
  store2.setlocalStorage()
  console.log('已经更新localStorage')
  alert('添加成功')
  
}

//弹出按钮控制根组件遮罩的显示
const pop = () => {
  store2.dialog = true
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 60px;
  background-color: var(--bcolor2);
  .navi-head {
    width: 960px;
    height: 60px;
    margin: 0 auto;
    background-color: transparent;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    .pic1 {
      width: 40px;
      margin-top: 15px;
    }
    .title {
      height: 40px;
      line-height: 40px;
      color: #e8e6e3;
      font-size: 32px;
      position: absolute;
      // background-color: aqua;
      top: 50%;
      transform: translate(0, -50%);
      left: 5%;
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
      left: 25%;
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
      display: flex;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      right: 0;
      .btn {
        border: 0;
        background-color: white;
        .pic2 {
          margin-left: 5%;
          width: 15px;
        }
        .pic3 {
          width: 20px;
        }
      }
      .btn2 {
        margin-top: 5%;
        text-align: center;
        background-color: transparent;
        opacity: 1;
        transition: all 1s;
      }
      .btn2:hover {
        opacity: 0;
        transition: all 1s;
        cursor: pointer;
      }
      .btn-i {
        opacity: 1;
        transition: all 1s;
      }
      .btn-i:hover {
        opacity: 0;
        transition: all 1s;
        cursor: pointer;
      }
    }
  }
}
</style>

<!-- space：\u00A0 -->
