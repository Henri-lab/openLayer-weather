<template>
  <div class="openmap">
    <div class="title" v-if="isPosition">
      <span class="now-position">您现在处于的位置:{{ local }}</span>
      <br />
      <span class="now-browsing">正在浏览：？？？</span>
    </div>
    <div class="title" v-else>
      <span class="welcome">欢迎来到{{ defaultCity }}╰(￣ω￣ｏ)</span>
      <br />
      <span
        class="position"
        @click="positionOnce"
        @mouseover="isHover = 1"
        @mouseleave="isHover = 0"
        ref="txt"
        ><span class="sec"><input type="text" class="input" /></span
        ><span class="text" v-show="!(isHover === 1)">{{ eleTxtInnerText }}</span></span
      >
    </div>
    <div id="myMap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'
import { useMapStore } from '@/stores/mapStore'
import { fetchCoordinatesH5 } from '@/util/positionH5'

const weatherInfoStore = useWeatherInfoStore()
const mapStore = useMapStore()

//
const defaultCity = mapStore.defaultCity
// user城市
const local = computed(() => weatherInfoStore.local)
// ol data
let map = null
const gdTile = mapStore.gdTile
const defaultView = mapStore.defaultView
const isPosition = computed(() => mapStore.isPosition())
const count = ref(999999999)
//
const eleTxt = ref('txt')
const isHover = ref(-1)
const eleTxtInnerText = ref(`秒后开始自动定位`)
let tempTxt = ''

// method---------------------------
//🌍加载map
async function load() {
  map = await new ol.Map({
    title: 'openMap',
    target: 'myMap',
    view: defaultView,
    layers: [gdTile]
  })
  mapStore.$map = map
  console.log(mapStore.longtitude, mapStore.latitude, '--old 经纬state')
}
// 🧭定位
async function getPosition(method) {
  if (method === 'H5') return await fetchCoordinatesH5()
}
async function position(method) {
  const position = await getPosition(method)
  mapStore.longtitude = position.jingH5
  mapStore.latitude = position.weiH5
}

async function positionOnce() {
  await position('H5')
  count.value = 0
}

function manuTxt() {
  tempTxt = eleTxtInnerText.value
  eleTxtInnerText.value = '立即定位'
}
function autoTxt() {
  eleTxtInnerText.value = tempTxt
}

// onMounted---------------------------
onMounted(async () => {
  await load()
  console.log(`${count.value}s后开始自动定位`)
  const timer = setInterval(async () => {
    if (count.value > 0) count.value--
    else {
      clearInterval(timer)
      await position('H5')
      console.log(mapStore.isPosition(), '定位成功？')
      //🌏🔄更新mapView在position更新之后
      if (mapStore.isPosition()) {
        console.log(mapStore.longtitude, mapStore.latitude, 'now 经纬state')
        map.getView().setCenter(ol.proj.fromLonLat([mapStore.longtitude, mapStore.latitude]))
      } else console.log('定位失败')
    }
  }, 1000)
})

watch(isHover, () => {
  // 确保eleTxt已经mounted
  if (eleTxt) {
    switch (isHover.value) {
      case 0:
        autoTxt()
        break
      case 1:
        manuTxt()
        break
      default:
        break
    }
  }
})

function test() {}
</script>

<style lang="scss" scoped>
.openmap {
  width: 960px;
  height: 580px;
  margin: 0 auto;
  margin-top: 10px;
  background-color: var(--bcolor2);
  #myMap {
    width: 100%;
    height: 500px;
    box-sizing: border-box;
    box-shadow: 50px 50px 100px;
  }
  .title {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    font-size: 20px;
    color: white;
    .position {
      color: rgb(0, 255, 240);
      font-weight: bolder;
      .input {
        width: 15%;
      }
    }
    .count:hover {
      cursor: pointer;
      color: deeppink;
    }
  }
}
</style>
