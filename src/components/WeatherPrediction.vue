<template>
  <div class="container">
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
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'

const store = useWeatherInfoStore()

const predictions = ref([])
const option = ref({})

onMounted(() => {
  loadData()
})

// 根据城市名称加载天气预报
const loadData = async () => {
  //store1的状态已经和页面保持同步：1.跳转会请求，请求则会更新；2.返回home已经时手动更新store1的状态；
  //获得当前页面城市的天气预报-直接使用store1中的数据，避免冗余请求
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
      splitLine: { show: false }
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
.container {
  width: 960px;
  height: 320px;
  margin: 0 auto;
  padding-top: 20px;
  position: relative;
  .predict {
    width: 100%;
    height: 300px;
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
    position: absolute;
    top: 29px
  }
}
</style>
