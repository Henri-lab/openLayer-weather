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
import featureStyle from '@/util/setStyle/featureStyle'
import sleep from '@/util/sleep'
import { getFeatureAtPixel } from '@/util/getOlObj/getFeature'
const mapStore = useMapStore()
const featureStore = useFeatureStore()
let map = null
let popup = null
const container = ref(null)
const closer = ref(null)
const content = ref(null)

let adcodeProvince = 0
let adcodeNextLevel = 0

const high_style_red = featureStyle({
  fillColor: '#FF0000'
})
const high_style_yellow = featureStyle({
  fillColor: '#FFFF00'
})

// 點擊処的feature元素
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

      // // mousemove时获取地图省级区划的矢量元素: featureAtPixelProvince_0
      map.on('pointermove', (e) => {
        const index=0
        featureAtPixelNextLevel_0.value = getFeatureAtPixel(e, map, 'layerWithBorderProvince',index,(featureArr)=>{})
        //   const pixel = map.getEventPixel(e.originalEvent)
        //   if (pixel) {
        //     // mousemove到有feature的區域
        //     map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        //       if (layer.get('name') === 'layerWithBorderProvince')
        //         featureAtPixelProvince_0.value = feature
        //       return true
        //     })
        //     // mousemove到沒有feature的區域
        //     if (!map.forEachFeatureAtPixel(pixel, () => true)) {
        //       // -----------------------------------------------------console.log('out china')
        //       mapStore.$layerSetStyle
        //         .getSource()
        //         .getFeatures()
        //         .forEach((item) => {
        //           item.setStyle(null)
        //         })
        //     }
        //   }

        if (featureAtPixelProvince_0.value && content.value) {
          let name = featureAtPixelProvince_0.value.get('name')
          adcodeProvince = featureAtPixelProvince_0.value.get('adcode')
          let level = featureAtPixelProvince_0.value.get('level')
          let template = `
                <p>adcode: <span>${adcodeProvince}</span></p>
                <p>name: <span>${name}</span></p>
                <p>Level: <span>${level}</span></p>
                `
          content.value.innerHTML = template
          popup.setPosition(e.coordinate)
        }
      })
      // 获取下一级的行政区划的矢量元素
      map.on('click', (e) => {
        // 记录上文pointermove事件中的省级区划的adcode
        adcodeProvince && (featureStore.currentAdcodeMousemove = adcodeProvince)
        // 获取点击处的矢量元素
        const pixel = map.getEventPixel(e.originalEvent)
        if (pixel) {
          map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            if (layer.get('name') === 'layerWithBorderNextLevel') {
              featureAtPixelNextLevel_0.value = feature
              return true
            }
          })
        }
        if (featureAtPixelNextLevel_0.value && content.value) {
          let name = featureAtPixelNextLevel_0.value.get('name')
          adcodeNextLevel = featureAtPixelNextLevel_0.value.get('adcode')
          let level = featureAtPixelNextLevel_0.value.get('level')
          let template = `
                <p>adcode: <span>${adcodeNextLevel}</span></p>
                <p>name: <span>${name}</span></p>
                <p>Level: <span>${level}</span></p>
                `
          content.value.innerHTML = template
          popup.setPosition(e.coordinate)
          adcodeNextLevel && (featureStore.currentAdcodeMousemove = adcodeNextLevel)
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
    console.log('watch---featureAtPixelProvince_0', featureAtPixelProvince_0.value)
    // -------------------------------------------------------------------------------------------------------------console.log('watch',mapStore.$layerWithPolygonByAliyun)
    // 经典排他
    mapStore.$layerSetStyle
      .getSource()
      .getFeatures()
      .forEach((item) => {
        item.setStyle(null)
      })
    featureAtPixelProvince_0.value && featureAtPixelProvince_0.value.setStyle(high_style_red)
  }
)

// 设置下一级区划矢量元素样式
watch(
  () => featureAtPixelNextLevel_0.value,
  () => {
    // -------------------------------------------------------------------------------------------------------------console.log('watch',mapStore.$layerWithPolygonByAliyun)
    // 经典排他
    mapStore.$layerSetStyle
      .getSource()
      .getFeatures()
      .forEach((item) => {
        item.setStyle(null)
      })
    featureAtPixelNextLevel_0.value && featureAtPixelNextLevel_0.value.setStyle(high_style_yellow)
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
