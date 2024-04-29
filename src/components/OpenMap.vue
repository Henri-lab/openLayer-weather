<template>
  <div class="openmap" @click.stop="isShow = !isShow">
    <div class="title" v-if="isPosition">
      <span class="now-position">您现在处于的位置:{{ local }}</span>
      <br />
      <span class="now-browsing">正在浏览：{{ mouseCity }}</span>
    </div>
    <div class="title" v-else>
      <span class="welcome">欢迎来到{{ defaultCity }}╰(￣ω￣ｏ)</span>
      <br />
      <span class="position"
        ><span class="sec"
          ><input
            type="text"
            class="input"
            v-show="!(isHover === 1)"
            v-model.trim.number.lazy="inputSec"
            :placeholder="count"
            @keypress.enter="isShowTraggle"
            v-if="isShow"
          />
          <span class="count" v-else @click.stop="isShow = true">
            {{ count }}
          </span> </span
        >&nbsp;<span
          class="text"
          ref="txt"
          @click="positionOnce"
          @mouseover="isHover = 1"
          @mouseleave="isHover = 0"
          >{{ eleTxtInnerText }}</span
        ></span
      >
    </div>
    <div id="myMap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'
import { useMapStore } from '@/stores/mapStore'
import { fetchCoordinatesH5 } from '@/util/positionH5'

const weatherInfoStore = useWeatherInfoStore()
const mapStore = useMapStore()

// 全局常量
const MAX = 51

//默认地点
const defaultCity = mapStore.defaultCity

// user城市
const local = computed(() => weatherInfoStore.local)

// mouse城市
const mouseCity = ref(local)

// ol data
let map = null
const gdTile = mapStore.gdTile
const defaultView = mapStore.defaultView
const isPosition = computed(() => mapStore.isPosition())
const count = ref(MAX)

//title中文本的设置
const eleTxt = ref('txt')
//--文本是否hover状态(default:-1)
//--mouseover状态:1
//--mouseleave状态:0
const isHover = ref(-1)
const eleTxtInnerText = ref(`秒后开始自动定位`)
let tempTxt = ''

// input交互
const inputSec = ref(null)
// input与count倒计时的显示isShow(default:false)
// --isShow:true-- input倒计时显示
// --isShow:false-- count显示
const isShow = ref(false)
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
  // console.log(mapStore.longtitude, mapStore.latitude, '--old 经纬state')
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
  eleTxtInnerText.value = '点击 立即定位'
}
function autoTxt() {
  eleTxtInnerText.value = tempTxt
}

function isShowTraggle() {
  count.value = 5
  isShow = !isShow
  // alert('Please enter valid number')
}
// onMounted---------------------------
onMounted(async () => {
  console.log('openmap mounted start')
  await load()
  // console.log(`${count.value}s后开始自动定位`)
  const timer = setInterval(async () => {
    if (count.value > 0) count.value--
    else {
      clearInterval(timer)
      await position('H5')
      console.log(mapStore.isPosition(), '定位成功？')
      //🌏🔄更新mapView在position更新之后
      if (mapStore.isPosition()) {
        // console.log(mapStore.longtitude, mapStore.latitude, 'now 经纬state')
        map.getView().setCenter(ol.proj.fromLonLat([mapStore.longtitude, mapStore.latitude]))
      } else console.log('定位失败')
    }
  }, 1000)
  console.log('openmap mounted done')
})

// 请求mouse放置的城市名称
watch(
  () => mapStore.mouseX,
  async () => {
    // console.log('watch x')
    await mapStore.getMouseCity()
    mouseCity.value = mapStore.mouseLocation
  },
  {
    immediate: true
  }
)

// 切换标题内容
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
    border: 0 1px solid var(--bcolor2);
    box-shadow: 50px 50px 100px;
    transition: all linear 0.3s;
  }
  #myMap:hover {
    border: 10px solid var(--bcolor3);
    box-shadow: 0 0 0;
    transition: all linear 0.3s;
  }
  .title {
    width: 50%;
    margin: 0 auto;
    margin-bottom: 5px;
    text-align: center;
    font-size: 20px;
    color: white;
    .position {
      color: rgb(0, 255, 240);
      font-weight: bolder;
      .input {
        width: 15%;
        height: 30px;
        margin-bottom: 5px;
      }
    }
    .position:hover {
      cursor: pointer;
      color: deeppink;
    }
  }
}
</style>
