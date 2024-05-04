<template>
  <div class="overlayer">
   
  </div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { onMounted } from 'vue'
import sleep from '../util/sleep'

const mapStore = useMapStore()
let map = null


onMounted(async() => {
  await sleep(0)
  map = mapStore.$map
  if (map) {
    const layer = await mapStore.getLayerBorder(100000)
    mapStore.OpenLayerComponentlayer=layer
    map.addLayer(layer)
    map.on('pointermove', function (e) {
      let pixel = map.getEventPixel(e.originalEvent)
      let hit = map.hasFeatureAtPixel(pixel)
      map.getTargetElement().style.cursor = hit ? 'pointer' : ''
    })   
  }
})
</script>

<style lang="scss" scoped></style>
