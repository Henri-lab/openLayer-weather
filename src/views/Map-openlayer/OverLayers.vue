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
import { ref, toRef, onMounted, watch } from 'vue'
import { featureStyle, setFeaturesStyleSingle } from '@/util/setStyle/setFeatureStyle'
import sleep from '@/util/sleep'
import { getFeatureAtPixel, getPropsFromFeatureByAliyun } from '@/util/getOlObj/getFeature'
const mapStore = useMapStore()
const featureStore = useFeatureStore()
let map = null
let popup = null
const container = ref(null)
const closer = ref(null)
const content = ref(null)

let adcodeProvince = 0

const high_style_red = featureStyle({
  fillColor: '#FF0000'
})
const high_style_yellow = featureStyle({
  fillColor: '#FFFF00'
})

// 點擊処的feature元素的省會features[0]
let featureAtPixelProvince_0 = ref(null)
let featureAtPixelNextLevel_0 = ref(null)
onMounted(async () => {
  await sleep(0)
  map = mapStore.$map
  if (map) {
    if (container.value) {
      popup = new ol.Overlay({
        // element: 'popup',
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: true,
        autoPanAnimation: {
          duration: 250
        }
      })

      // // mousemove时获取地图省级区划的矢量元素
      const index = 0
      map.on('pointermove', (e) => {
        //获取
        featureAtPixelProvince_0.value = getFeatureAtPixel(
          e,
          map,
          'layerWithBorderProvince',
          index,
          (featureArr) => {}
        )
        // 填充矢量元素區劃信息到popup
        if (featureAtPixelProvince_0.value && content.value) {
          const props = getPropsFromFeatureByAliyun([featureAtPixelProvince_0.value])[0]
          content.value.innerHTML = text(props.adcode, props.name, props.level)
          popup.setPosition(e.coordinate)
        }
      })
      // click获取下一级的行政区划的矢量元素
      map.on('click', (e) => {
        // 记录上文pointermove事件中的省级区划的adcode
        adcodeProvince && (featureStore.currentAdcodeMousemove = adcodeProvince)
        // 获取
        featureAtPixelNextLevel_0.value = getFeatureAtPixel(
          e,
          map,
          'layerWithBorderProvince',
          index,
          (featureArr) => {}
        )
        // 填充矢量元素區劃信息到popup
        if (featureAtPixelNextLevel_0.value && content.value) {
          const props = getPropsFromFeatureByAliyun([featureAtPixelNextLevel_0.value])[0]
          content.value.innerHTML = text(props.adcode, props.name, props.level)
          popup.setPosition(e.coordinate)
          adcode && (featureStore.currentAdcodeMousemove = props.adcode)
        }
      })

      // popup的关闭按钮
      if (closer.value) {
        closer.value.addEventListener('click', function () {
          popup.setPosition(undefined)
          closer.value.blur()
          return false
        })
      }
    }
  }
})
// 设置省级区划矢量元素样式
watch(
  () => featureAtPixelProvince_0.value,
  () => {
    setFeaturesStyleSingle(
      mapStore.$layerSetStyle,
      [featureAtPixelProvince_0.value],
      high_style_red
    )
  }
)

// 设置下一级区划矢量元素样式
watch(
  () => featureAtPixelNextLevel_0.value,
  () => {
    setFeaturesStyleSingle(
      mapStore.$layerSetStyle,
      [featureAtPixelNextLevel_0.value],
      high_style_yellow
    )
  }
)

// zoom变大时，改变矢量元素的样式
watch(
  () => mapStore.currentZoom,
  () => {
    if (map.getView().getZoom() > 5)
      featureAtPixelProvince_0.value && featureAtPixelProvince_0.value.setStyle(null)
    else featureAtPixelProvince_0.value && featureAtPixelProvince_0.value.setStyle(high_style_red)
  }
)

function text(a, b, c) {
  const text = `
                <p>adcode: <span>${a}</span></p>
                <p>name: <span>${b}</span></p>
                <p>Level: <span>${c}</span></p>
                `
  return text
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
