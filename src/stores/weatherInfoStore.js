import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLocal, getAdcode, getWeatherPrediction, getWeatherLive } from '@/api'

export const useWeatherInfoStore = defineStore('store1', () => {
  //查询所在城市
  const local = ref('')
  const getLocalInfo = async () => {
    console.log('getLocalInfo/store')
    const res = await getLocal()
    local.value = res.city
    console.log('getLocalInfo/store done', ':local=' + res.city)
  }

  // 获得城市adcode,获取城市完整name;获取失败则返回 '0'
  const cityAdcode = ref('')
  const cityName = ref('')
  const getCityAdcode = async (city) => {
    console.log('getCityAdcode/store')
    if (city) {
      const res = await getAdcode(city)
      // 匹配成功
      if (res.data.status!=='0') {
        cityAdcode.value = res.data.geocodes[0].adcode
        cityName.value = res.data.geocodes[0].city
        console.log('getCityAdcode/store done', ':cityAdcode=' + cityAdcode.value, ':cityFullName=' + cityName.value)
      }
      // 匹配失败
      else {
        cityAdcode.value = ""
        cityName.value = ""
        console.log('getCityAdcode/store failed')
      }
    } else {
      console.log('getCityAdcode/store failed')
    }
  }

  // 查询预报天气
  const weatherPrediction = ref([])
  const getWeatherPredictionInfo = async (adcode) => {
    console.log('getWeatherPredictionInfo/store')
    if (adcode) {
      const res = await getWeatherPrediction(adcode)

      const pres=res.data.forecasts[0].casts//>.< ；postman返回的不是全部；漏写这句找bug找了好久！！

      weatherPrediction.value = pres.map(item => {
        console.log('getWeatherPredictionInfo/store done','WeatherPrediction:', weatherPrediction.value)
        return {
          date: item.date,
          dayweather: item.dayweather,
          daypower: item.daypower,
          daytemp: item.daytemp,
          nighttemp: item.nighttemp
        }
      })
    } else {
      console.log('getWeatherPredictionInfo/store fail')
    }
  }
  // 查询实况天气
  const weatherLive = ref({})
  const getWeatherLiveInfo = async (adcode) => {
    console.log('getWeatherLiveInfo/store')
    if (adcode) {
      const res = await getWeatherLive(adcode)
      const pres = res.data.lives[0]
      weatherLive.value = {
        weather: pres.weather,
        temperature: pres.temperature,
        winddirection: pres.winddirection,
        windpower: pres.windpower
      }
      console.log('getWeatherLiveInfo/store done', ':weatherLive=', weatherLive.value)
    } else {
      console.log('getWeatherPredictionInfo/store fail')
    }
  }

  //查询日期的星期数:例如2024-04-11;
  const getFormatDay = (format) => {
    const date = new Date(format);
    const options = { weekday: 'long' };
    const day = new Intl.DateTimeFormat('zh-CN', options).format(date);
    return day
  }
  return {
    local,
    cityAdcode,
    weatherPrediction,
    weatherLive,
    cityName,
    getLocalInfo,
    getCityAdcode,
    getWeatherLiveInfo,
    getWeatherPredictionInfo,
    getFormatDay,
  }
})

// 写完数据发现undefined 检查return否+检查是不是没有写在then方法里




