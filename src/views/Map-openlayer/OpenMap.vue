<template>
  <div class="openmap">
    <div class="title" v-if="isPosition">
      <span class="now-position" @click="animateHinge" ref="animateHTML"
        >您现在处于的位置:{{ location }}</span
      >
      <br />
      <span class="now-browsing" v-show="isBrowse">点击城市：{{ mouseCity }}</span>
    </div>
    <div class="title" v-else>
      <span class="welcome">欢迎来到{{ defaultCity }}</span>
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
          @click="updatePositionH5('immediate')"
          @mouseover="isHover = 1"
          @mouseleave="isHover = 0"
          >{{ eleTxtInnerText }}</span
        ></span
      >
    </div>
    <div id="myMap"><canvas ref="myCanvas" height="0"></canvas></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, inject, getCurrentInstance } from 'vue'
import { useWeatherInfoStore } from '@/stores/weatherInfoStore'
import { useMapStore } from '@/stores/mapStore'
import { useMouseStore } from '@/stores/mouseStore'
import getPosition from '@/util/position'

const weatherInfoStore = useWeatherInfoStore()
const mapStore = useMapStore()
const mouseStore = useMouseStore()

const animateHTML = ref(null)

// ol data
let $map = null
let gdXYZ = new ol.source.XYZ({
  title: mapStore.gdXYZ_title,
  url: mapStore.gdXYZ_url,
  wrapX: mapStore.gdXYZ_wrapX
})
let gdTile = new ol.layer.Tile({
  title: mapStore.gdTile_title,
  source: gdXYZ
})
let defaultView = new ol.View({
  center: ol.proj.fromLonLat([mapStore.longtitude, mapStore.latitude]),
  zoom: mapStore.zoom,
  minZoom: mapStore.minZoom
})

const isPosition = computed(() => mapStore.isPosition())
const count = ref(MAX)

// 全局常量
const MAX = 999999999

//默认地点
const defaultCity = mapStore.defaultCity

// user城市
const location = ref('武汉')
watch(
  () => weatherInfoStore.local,
  () => {
    location.value = weatherInfoStore.local
  },
  {
    immediate: true
  }
)

// 正在浏览文本的显示 (default:不显示，因为最开始拿不到城市，需要点击鼠标才获取到)
const isBrowse = ref(false)
// mouse处的城市名称
const mouseCity = ref('')
const range = 0.3
// 请求api的频率控制
// --Int+range:都可以调整变化的反应权重
// --根据已知正在浏览的城市的中心点和鼠标移动后的经纬度计算你是否切换城市
watch(
  () => parseInt([mouseStore.mouseJing * range, mapStore.mouseWei * range]),
  async () => {
    // 初次定位之后,如果经纬度变化一定程度，就添加动画
    if (isPosition.value) {
      console.log('animation')
    }
  },
  {
    immediate: true
  }
)

//title中文本的设置
const eleTxt = ref('txt')
//--文本是否hover状态(default:-1)
//--mouseover状态:1
//--mouseleave状态:0
const isHover = ref(-1)
const eleTxtInnerText = ref(`秒后开始自动定位`)
let tempTxt = ''
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

// input交互
const inputSec = ref(null)
// input与count倒计时的显示isShow(default:false)
// --isShow:true-- input倒计时显示
// --isShow:false-- count显示
const isShow = ref(false)

// onMounted---------------------------
onMounted(async () => {
  // $map = mapStore.loadMap('openMap', 'myMap', defaultView, gdTile)
  $map = loadMap()
  const app=inject('app')
  app.config.globalProperties.$map = $map
  console.log(gdTile.get('title'),gdXYZ.get('title'))//???

  const timer = setInterval(async () => {
    if (count.value > 0) count.value--
    else {
      clearInterval(timer)
      await updatePositionH5()
      //🌏🔄更新mapView在position更新之后
      if (mapStore.isPosition()) {
        let viewPosition = $map.getView()
        viewPosition.animate({
          center: ol.proj.fromLonLat([mapStore.longtitude, mapStore.latitude]),
          zoom: mapStore.animateZoom,
          duration: mapStore.animateDuration
        })
      } else console.log('定位失败')
    }
  }, 1000)

  // 定位之后--点击地图获取鼠标点击处的中国城市
  $map.on('click', async () => {
    console.log('mouse-->jing,wei:', mouseStore.mouseJing, ',', mouseStore.mouseWei)
    // '正在浏览:'这行文本的显示
    // --如果拿不到城市就'隐藏'
    // --如果拿到城市就'显示'
    if (
      // 中国经纬度大概范围+定位之后
      mouseStore.mouseJing < 135.05 &&
      mouseStore.mouseJing > 73.66 &&
      mouseStore.mouseWei < 53.56 &&
      mouseStore.mouseWei > 3.86 &&
      isPosition.value
    ) {
      await mouseStore.getMouseCity(mouseStore.mouseJing, mouseStore.mouseWei)
      if (mouseStore.mouseCity.length === 0) isBrowse.value = false
      else {
        isBrowse.value = true
        mouseCity.value = mouseStore.mouseCity
      }
    }
  })
})

// method---------------------------

//🌏
function loadMap() {
  return new ol.Map({
    title: 'openmap',
    target: 'myMap',
    view: defaultView,
    layers: [gdTile]
  })
}

// 🧭定位
async function updatePositionH5(type) {
  //前提：count === 0时定时器启动定位:updatePositionH5
  if (type === 'immediate') count.value = 0
  const position = await getPosition('H5')
  mapStore.longtitude = position.jingH5
  mapStore.latitude = position.weiH5
}
// 📃title文本切换
// --文本1默认
function manuTxt() {
  tempTxt = eleTxtInnerText.value
  eleTxtInnerText.value = '点击 立即定位'
}
// --文本2
function autoTxt() {
  eleTxtInnerText.value = tempTxt
}
// --切换
function isShowTraggle(e) {
  if (e.target.className) console.log(e.target.className)
  count.value = 5
  isShow.value = !isShow.value
}

// 动画库
let box = null
function animateHinge() {
  animateHTML.value && (box = animateHTML.value)
  box.classList.add('animate__animated', 'animate__flash')
  // Remove the class after the animation is completed
  box.addEventListener('animationend', () => {
    box.classList.remove('animate__animated', 'animate__flash')
  })
}
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
    margin-top: 15px;
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
