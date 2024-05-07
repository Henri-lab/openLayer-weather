<template>
  <div class="openlayer"></div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { onMounted } from 'vue'
import sleep from '@/util/sleep'

const mapStore = useMapStore()
let map = null

onMounted(async () => {
  await sleep(0)
  map = mapStore.$map
  if (map) {
    const layer = await mapStore.getLayerWithPolygonByAdcodeByAliyun(100000)
    map.addLayer(layer)
    map.on('pointermove', function (e) {
      let pixel = map.getEventPixel(e.originalEvent)
      let hit = map.hasFeatureAtPixel(pixel)
      map.getTargetElement().style.cursor = hit ? 'pointer' : ''
    })
    // 监听地图的缩放事件
    map.getView().on('change:resolution', function (e) {
      let currentZoom = map.getView().getZoom()
      mapStore.currentZoom = parseInt(currentZoom)
      // --------------------------------------------------------------------------console.log('地图缩放级别变为：' +  mapStore.currentZoom)
    })
  }
})
</script>

