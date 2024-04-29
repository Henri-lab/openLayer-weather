<template>
  <div class="opencontrol">
    <span class="tech">openLayer|高德地图API|</span>
    <div id="coordinates" ref="mouse"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import coordinateFormat from '@/util/coordinateFormat'
const mapStore = useMapStore()
const mouse = ref(null)
let $map = null
async function sleep(time) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
onMounted(async () => {
  // ✨只要有await就会拿到$map
  await sleep(0)
  await nextTick()
  console.log('opencontrol mounted start')
  $map = mapStore.$map
  if ($map) {
    console.log('$map has already generated in the map store')
    const gdTile = mapStore.gdTile
    const navControl = new ol.control.ZoomToExtent({
      extent: [116.2, 39.75, 116.5, 40.05]
    })
    $map.addControl(navControl)

    const zoomslider = new ol.control.ZoomSlider()
    $map.addControl(zoomslider)

    $map.on('pointermove', (e) => {
      if (mouse.value) {
        let domEle = mouse.value
        console.log(e.coordinate)
        let arr=e.coordinate.map((item) => item)
        domEle.innerHTML = coordinateFormat(arr[0],arr[1])
        
      }
    })
    const overviewMapControl = new ol.control.OverviewMap({
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: [gdTile],
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: false,
      view: new ol.View({
        projection: 'EPSG:4326',
        minZoom: 8,
        maxZoom: 18
      })
    })
    $map.addControl(overviewMapControl)

    const fullScreen = new ol.control.FullScreen()
    $map.addControl(fullScreen)
  } else {
    console.error('$map is not initialized.')
    return
  }
  console.log('opencontrol mounted done')
})
</script>

<style lang="scss" scoped>
.opencontrol {
  position: relative;
  width: 960px;
  height: 25px;
  margin: 0 auto;
  background-color: var(--bcolor2);
  .tech {
    color: white;
  }
  #coordinates {
    position: absolute;
    z-index: 100;
    left: 50%;
    top: -240%;
    transform: translate(-50%, -50%);
    transform: translateX(-50%);
    width: 25%;
    height: 100%;
    background-color: #652e8080;
    text-align: center;
    line-height: 25px;
    color: #fff;
    border-radius: 5px;
    .ol-zoomslider {
      top: 7.5em !important;
      background-color: #652e8099;
    }
    .ol-zoomslider:hover {
      background-color: #652e8080;
      cursor: pointer;
    }

    .ol-custom-overviewmap {
      left: 0;
      bottom: 0;
      top: auto;
      left: auto;
    }

    .ol-overviewmap-box {
      border: 1px solid #ff2d51;
    }
  }
}
</style>
