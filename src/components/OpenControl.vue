<template>
  <div id="mouse"></div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore
onMounted(() => {
  const $map = mapStore.$map
  const navControl = new ol.control.ZoomToExtent({
    extent: [100, 30, 140, 30]
  })
  $map.addControl(navControl)

  const zoomslider = new ol.control.ZoomSlider()
  $map.addControl(zoomslider)

  $map.on('pointermove', (e) => {
    let mouse = document.getElementById('mouse')
    mouse.innerHTML = e.coordinate.map((item) => item.toFixed(2))
  })
  const overviewMapControl = new ol.control.OverviewMap({
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [gd],
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
})
</script>

<style scoped>
.ol-zoomslider {
  top: 7.5em !important;
  background-color: #652e8099;
}
.ol-zoomslider:hover {
  background-color: #652e8080;
  cursor: pointer;
}
#mouse {
  position: fixed;
  bottom: 20px;
  z-index: 100;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 40px;
  background-color: #652e8080;
  text-align: center;
  line-height: 40px;
  color: #fff;
  border-radius: 5px;
}
.ol-custom-overviewmap {
  /* position: fixed; */
  left: 0;
  bottom: 0;
  top: auto;
  left: auto;
}

.ol-overviewmap-box {
  border: 1px solid #ff2d51;
}
</style>
