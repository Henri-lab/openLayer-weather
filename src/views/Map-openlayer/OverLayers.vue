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
import { ref, onMounted, watch } from 'vue'
import sleep from '@/util/sleep'
const mapStore = useMapStore()
let map = null
let popup = null
const container = ref(null)
const closer = ref(null)
const content = ref(null)

const high_style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: '#4164fb'
  })
})
let featureAtPixelFirst = ref(null)
onMounted(async () => {
  await sleep(0)
  map = mapStore.$map
  if (map) {
    if (container.value) {
      popup = new ol.Overlay({
        element: container.value,
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: true,
        autoPanAnimation: {
          duration: 250
        }
      })

      map.on('click', (e) => {
        const pixel = map.getEventPixel(e.originalEvent)
        if (pixel) {
          map.forEachFeatureAtPixel(pixel, (feature) => {
            featureAtPixelFirst.value = feature
            return true
          })
        }
        if (featureAtPixelFirst.value && content.value) {
          let name = featureAtPixelFirst.value.get('name')
          let adcode = featureAtPixelFirst.value.get('adcode')
          let level = featureAtPixelFirst.value.get('level')
          let template = `
                <p>adcode: <span>${adcode}</span></p>
                <p>name: <span>${name}</span></p>
                <p>Level: <span>${level}</span></p>
                `
          content.value.innerHTML = template
          popup.setPosition(e.coordinate)
        }
      })

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
watch(
  () => featureAtPixelFirst.value,
  () => {
    console.log('watch',mapStore.$layerWithPolygonByAliyun)
    // 经典排他
    mapStore.$layerWithPolygonByAliyun.getSource()
      .getFeatures()
      .forEach((item) => {
        item.setStyle(null)
      })
    featureAtPixelFirst.value && featureAtPixelFirst.value.setStyle(high_style)
  }
)
</script>

<style scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 10px;
  left: -50px;
  min-width: 120px;
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

#popup-content p span {
  color: #4164fb !important;
}
</style>
