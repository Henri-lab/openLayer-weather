<template>
  <div class="overlayer">
    <div id="popup" class="ol-popup" ref="container">
      <a href="#" id="popup-closer" class="ol-popup-closer" ref="closer"></a>
      <div id="popup-content" ref="content"></div>
    </div>
  </div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { useFeatureStore } from '@/stores/featureStore'
import { ref, inject, onMounted, watch } from 'vue'
import { featureStyle, setFeaturesStyleSingle } from '@/util/setStyle/setFeatureStyle'
import sleep from '@/util/sleep'
import { getFeatureAtPixel, getPropsFromFeatureByAliyun } from '@/util/getOlObj/getFeature'
import { getView_zoomToAddress } from '@/util/getView'
const mapStore = useMapStore()
const featureStore = useFeatureStore()

const isOnMounted = ref(false)

let $map = null
let popup = null
const container = ref(null)
const closer = ref(null)
const content = ref(null)

let adcodeLevel = null
let adcodeNextLevel = null

// click 为 pointermove加锁解锁
let flag_isPointermoveTriggered = ref(1)

const cityNameLevel = ref(0)

const high_style_red = featureStyle({
  fillColor: '#FF0000'
})
const high_style_yellow = featureStyle({
  fillColor: '#FFFF00'
})

// feature
let currentLevel = ref(null)
let nextLevel = ref(null)

onMounted(() => {
  const app = inject('app')
  $map = app.config.globalProperties.$map

  if ($map) {
    if (container.value) {
      // 挂载popup
      popup = new ol.Overlay({
        // element: 'popup',
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: true,
        autoPanAnimation: {
          duration: 250
        }
      })
      // popup的关闭按钮
      if (closer.value) {
        closer.value.addEventListener('click', function () {
          closer.value.blur()
          return false
        })
      }
    }
    isOnMounted.value = true
  }
})

// 设置省级区划矢量元素样式
watch(
  () => cityNameLevel.value,
  () => {
    const layers = $map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('name') === 'layerWithBorderProvince')

    setFeaturesStyleSingle(layers, [currentLevel.value], high_style_red)
  }
)

// 设置下一级区划矢量元素样式
watch(
  () => nextLevel.value,
  () => {
    const layers = $map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('name') === 'layerWithBorderNextLevel')
    setFeaturesStyleSingle(layers, [nextLevel.value], high_style_yellow)
  }
)

// zoom变大时，改变矢量元素的样式
watch(
  () => mapStore.currentZoom,
  () => {
    console.log('pointer move triggered', flag_isPointermoveTriggered.value)
    if ($map.getView().getZoom() > 5) currentLevel.value && currentLevel.value.setStyle(null)
    else currentLevel.value && currentLevel.value.setStyle(high_style_red)
  }
)

// 生產一段文本
function text(a, b, c) {
  const text = `
                <p>adcode: <span>${a}</span></p>
                <p>name: <span>${b}</span></p>
                <p>Level: <span>${c}</span></p>
                `
  return text
}

// 挂载完毕开启下钻功能
watch(
  () => isOnMounted.value,
  () => {}
)

// method
function goDeeper(adcodeLevel, adcodeNextLevel) {
  const findOuterCity = $map.on('pointermove', (e) => {
    if (flag_isPointermoveTriggered) getCurrentFeatureProps_in_LayerNameIsLevel(e)
  })
  const findInnerCity = $map.on('click', async (e) => {
    flag_isPointermoveTriggered = 0

    zoomToCurrentCityClicked_in_LayerNextLevel(e)

    await sleep(2000)
    flag_isPointermoveTriggered = 1
  })

  unEvent($map, findOuterCity, findInnerCity)

  const nextNextLevel = getNextLevelByAdcode(featureStore.currentAdcodeNextLevel)
  goDeeper(adcodeNextLevel, nextNextLevel)
}

// 根据当前你正在点击的矢量数据的adcode,name属性--更新move处adcodeLevel
// ===剩下工作由OpenLayer.Vue完成===
// \\🐱‍👤// openlayer.vue会根据featureStore.currentAdcodeLevel的改变添加此adcode的下一级feature
function getCurrentFeatureProps_in_LayerNameIsLevel(e) {
  const layerName = 'layerLevel'
  let featureArr = getFeatureAtPixel(e, $map, layerName)
  currentLevel = featureArr[0]

  if (currentLevel && content.value) {
    const prop = getPropsFromFeatureByAliyun([currentLevel])[0]
    content.value.innerHTML = text(prop.adcode, prop.name, prop.level)
    cityNameLevel.value = prop.name

    adcodeLevel = prop.adcode
    adcodeLevel !== null && (featureStore.currentAdcodeLevel = adcodeLevel)
  }
}

// 获取(layerName:'layerNextLevel')的矢量元素数组
// --持续获取直到获取到
// 将矢量元素的元素设置行为：
// --根据address(featureAliyun.name)获取，设置跳转效果的view
// --记录点击处的adcodeNextLevel
function zoomToCurrentCityClicked_in_LayerNextLevel(e) {
  const layerName = 'layerNextLevel'
  const time = setInterval(() => {
    let featureArr = getFeatureAtPixel(e, $map, layerName)
    if (!featureArr.length) getFeatureAtPixel(e, $map, layerName)
    else {
      clearInterval(time)

      featureArr.forEach(async (feature) => {
        if (feature) {
          const prop = getPropsFromFeatureByAliyun([feature])[0]

          const mainCity = prop.name
          const view_zoomToMaincity = await getView_zoomToAddress(mainCity, { zoom: 10 })
          $map.setView(view_zoomToMaincity)

          adcodeNextLevel = prop.adcode
          adcodeNextLevel != null && (featureStore.currentAdcodeNextLevel = adcodeNextLevel)
        }
      })
    }
  }, 100)
}

// 卸载事件
function unEvent($map, pointermoveEventName, clickEventName) {
  if (pointermoveEventName.length) {
    pointermoveEventName.forEach((name) => {
      $map.un('pointermove', name)
    })
  } else if (pointermoveEventName == []) console.error('PointermoveEventName is empty')
  else $map.un('pointermove', pointermoveEventName)
  if (clickEventName.length) {
    clickEventName.forEach((name) => {
      $map.un('click', name)
    })
  } else if (clickEventName == []) console.error('clickmoveEventName is empty')
  else $map.un('click', clickEventName)
}
</script>

<style scoped>
.ol-popup {
  width: 200px;
  padding: 5px;
  background-color: greenyellow;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  border-radius: 10px;
  border: 1px solid #cccccc;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: '✖';
}

#popup-content {
  font-size: 12px;
  font-family: '微软雅黑';
}

#popup-content .markerInfo {
  font-weight: bold;
}

#popup-content p {
  color: gray !important;
}
</style>
@/util/setView
