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

let $map = null
let popup = null
const container = ref(null)
const closer = ref(null)
const content = ref(null)

let adcodeProvince = null

let flag_isClickTriggered = 0 // 如果click正在执行中，为1，pointermove就不执行，防止其修改click回调所设置的数据

const province = ref(0)

const high_style_red = featureStyle({
  fillColor: '#FF0000'
})
const high_style_yellow = featureStyle({
  fillColor: '#FFFF00'
})

// 點擊処的feature元素的省會features[0]
let featureAtPixelProvince_0 = ref(null)
let featureAtPixelNextLevel_0 = ref(null)
onMounted(() => {
  const app = inject('app')
  $map = app.config.globalProperties.$map
  if ($map) {
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

      // mousemove：

      // --当clcik不正在执行时
      // 1.获取省级区划行政区划的矢量元素
      // 2.将矢量元素的name，adcode，level属性加载至popup, .name设置响应性，表明正在mousemove
      // 3.记录此省级城市adcode🚩
      $map.on('pointermove', (e) => {
        if (!flag_isClickTriggered) {
          const index = 0
          featureAtPixelProvince_0.value = getFeatureAtPixel(
            e,
            $map,
            'layerWithBorderProvince',
            index,
            (featureArr) => {}
          )

          if (featureAtPixelProvince_0.value && content.value) {
            const props = getPropsFromFeatureByAliyun([featureAtPixelProvince_0.value])[0]
            content.value.innerHTML = text(props.adcode, props.name, props.level)
            province.value = props.name

            adcodeProvince = props.adcode
          }
        }
      })
      // click：
      // 0.--修改flag
      // 1.读取记录的省级城市adcode🚩
      // 2.获取（根据adcode返回）的下一级的行政区划的矢量元素
      // 3.将矢量元素的首个元素（mainCity）name，adcode，level属性加载至popup
      // 4.根据address(featureAliyun)获取其location，并设置跳转效果的view
      // 5.记录点击处的adcode
      // 6.--还原flag
      $map.on('click', async (e) => {
        flag_isClickTriggered = 1

        adcodeProvince !== null && (featureStore.currentAdcodeMousemove = adcodeProvince)

        const index = 0
        featureAtPixelNextLevel_0.value = getFeatureAtPixel(
          e,
          $map,
          'layerWithBorderProvince',
          index,
          (featureArr) => {}
        )

        if (featureAtPixelNextLevel_0.value && content.value) {
          const props = getPropsFromFeatureByAliyun([featureAtPixelNextLevel_0.value])[0]
          content.value.innerHTML = text(props.adcode, props.name, props.level)

          const mainCity = props.name
          const view_zoomToMaincity = await getView_zoomToAddress(mainCity, { zoom: 10 })
          $map.setView(view_zoomToMaincity)

          props.adcode && (featureStore.currentAdcodeMouseClick = props.adcode)
        }

        flag_isClickTriggered = 0
      })

      // popup的关闭按钮
      if (closer.value) {
        closer.value.addEventListener('click', function () {
          closer.value.blur()
          return false
        })
      }
    }
  }
})
// 设置省级区划矢量元素样式

watch(
  () => province.value,
  () => {
    const layers = $map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('name') === 'layerWithBorderProvince')

    setFeaturesStyleSingle(layers, [featureAtPixelProvince_0.value], high_style_red)
  }
)

// 设置下一级区划矢量元素样式
watch(
  () => featureAtPixelNextLevel_0.value,
  () => {
    const layers = $map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('name') === 'layerWithBorderNextLevel')
    setFeaturesStyleSingle(layers, [featureAtPixelNextLevel_0.value], high_style_yellow)
  }
)

// zoom变大时，改变矢量元素的样式
watch(
  () => mapStore.currentZoom,
  () => {
    if ($map.getView().getZoom() > 5)
      featureAtPixelProvince_0.value && featureAtPixelProvince_0.value.setStyle(null)
    else featureAtPixelProvince_0.value && featureAtPixelProvince_0.value.setStyle(high_style_red)
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
