<template>
  <div id="myMap"></div>
  <button @click="test">test</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'

const weatherInfoStore = useWeatherInfoStore()
const location = useWeatherInfoStore.local

//经纬度 default：TianAn
const longitude = ref(116.404)
const latitude = ref(39.915)

const xyz = new ol.source.XYZ({
  title: 'myXYZ',
  url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
  wrapX: true
})
const gd = new ol.layer.Tile({
  title: 'myTile',
  source: xyz
})
const view = ref(
  new ol.View({
    // 在 OpenLayers 中添加标记、设置地图中心或处理几何数据时，应始终使用 ol.proj.fromLonLat 来确保坐标的正确转换和显示。
    center: ol.proj.fromLonLat([longitude.value, latitude.value]),
    zoom: 15
  })
)

// onMounted---------------------------
{
  // 挂载初始地图
  onMounted(async () => {
    const map = await new ol.Map({
      title: 'position',
      target: 'myMap',
      view: view.value,
      layers: [gd],
      controls: [],
      interactions: '',
      overlays: []
    })
    console.log(map, 'map')
  })

  // 定位--根据user所在位置更新view的center
  onMounted(async () => {
    setTimeout(async () => {
      await fetchCoordinates()
      console.log(longitude.value, latitude.value, 'longitude,latitude')
      if (longitude.value !== 114.3 && latitude.value !== 30.5)
        view.value.setCenter(ol.proj.fromLonLat([longitude.value, latitude.value]))
    }, 1500)
  })
}

function test() {
  console.log(longitude.value, latitude.value)
}
// 获取H5坐标
const fetchCoordinates = async () => {
  try {
    const { weidu, jingdu } = await getGeolocation()
    if ((jingdu, weidu)) {
      longitude.value = jingdu
      latitude.value = weidu
    }
  } catch (error) {
    console.error('Error getting location:', error)
  }
}
// '返回坐标'的Promise:方便await/then;
const getGeolocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          weidu: position.coords.latitude,
          jingdu: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      }
    )
  })
}
</script>
<script></script>

<style lang="scss" scoped>
#myMap {
  width: 960px;
  height: 500px;
  margin: 0 auto;
  margin-top: 20px;
  box-sizing: border-box;
  border-top: 10px solid darkolivegreen;
  box-shadow: 50px 50px 100px;
}
</style>
