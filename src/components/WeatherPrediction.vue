<template>
  <span class="title">近期天气</span>
  <div class="predict">
    <ul class="list">
      <li class="dayweather" v-for="(item, index) in predictions" :key="index">
        <span class="day" v-if="index !== 0 && index !== 1">{{ item.day }}</span>
        <span class="day" v-if="index === 0">今天</span>
        <span class="day" v-if="index === 1">明天</span>
        <span class="date">{{ item.date }}</span>
        <span class="weather">{{ item.dayweather }}</span>
        <span class="power">风力&nbsp;{{ item.daypower }}级</span>
      </li>
    </ul>
    <div class="chart">
      <v-chart :option="option" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'
const route = useRoute()
const store = useWeatherInfoStore()
const cityName = ref('')
watchEffect(() => (cityName.value = store.local))
watchEffect(() => (cityName.value = route.query.cityName))
const predictions = ref([])
const option = ref({})

onMounted(() => {
  loadData()
})

// 根据城市名称加载天气预报
const loadData = async () => {
  // 获得城市预报-直接使用store中的数据，避免冗余请求
  console.log('预告组件调用')
  await store.getWeatherPredictionInfo(store.cityAdcode)
  //处理并返回新天气预报数据
  return store.weatherPrediction.map((item) => {
    const day = store.getFormatDay(item.date).replace('星期', '周')
    const date = new Date(item.date)
    const formattedDate = (date.getMonth() + 1 + '-' + date.getDate()).padStart(2, '0')
    return {
      day,
      date: formattedDate,
      daytemp: item.daytemp,
      nighttemp: item.nighttemp,
      dayweather: item.dayweather,
      daypower: item.daypower
    }
  })
}
watch(
  () => store.cityAdcode,
  async () => {
    console.log('天气预报~loading ')
    predictions.value = await loadData()
    console.log('天气预报~加载完毕')
    console.log('renderChart')
    renderChart(
      predictions.value.map((item) => item.daytemp),
      predictions.value.map((item) => item.nighttemp)
    )
  }
)

//
const renderChart = (v1, v2) => {
  option.value = {
    xAxis: {
      type: 'category',
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {show: false}
    },
    series: [
      {
        name: 'daytemp',
        data: v1,
        type: 'line',
        smooth: true,
        label: {
          show: true, // Shows data value at each point on the line
          position: 'top',
          //'c'
          formatter: '白{c}℃',
          fontSize: 10
        }
      },
      {
        name: 'nighttemp',
        data: v2,
        type: 'line',
        smooth: true,
        label: {
          show: true,
          position: 'top',
          formatter: '晚{c}℃',
          fontSize: 10
        }
      }
    ],
    grid: {
      show: false,
      height: 'auto'

    }
  }
}
</script>

<style lang="scss" scoped>
.predict {
  width: 960px;
  height: 300px;
  margin: -20px auto;
  background-color: rgba(0, 82, 110, 0.5);
  .list {
    display: flex;
    width: 100%;
    height: 200px;
    margin-top: 20px;
    list-style: none;
    flex-direction: row;
    justify-content: space-evenly;
    .dayweather {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-top: 30px;
      text-align: center;
      height: 100px;
      font-size: 12px;
    }
  }
  .chart {
    width: 100%;
    height: 300px;
    margin-top: -100px;
  }
}
.title {
  margin-left: 280px;
}
</style>