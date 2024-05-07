<template>
  <div class="openlayer"></div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { useFeatureStore } from '@/stores/featureStore'
import { onMounted, watch } from 'vue'
import sleep from '@/util/sleep'

const mapStore = useMapStore()
const featureStore = useFeatureStore()
let map = null

onMounted(async () => {
  await sleep(0)
  map = mapStore.$map
  if (map) {
    // 添加带矢量元素的图层
    const layerWithBorderProvince = await mapStore.getLayerWithPolygonByAdcodeByAliyun(100000)
    layerWithBorderProvince.set('name', 'layerWithBorderProvince')
    map.addLayer(layerWithBorderProvince)
    // 鼠标探测是否有矢量元素，如果有就改变cursor样式
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
watch(
  () => featureStore.currentAdcodeMousemove,
  async () => {
    console.log('cc')
    // 移除先前添加的部分图层
    map.getLayers().forEach((layer) => {
      if (layer.get('name') === 'layerWithBorderNextLevel') {
        map.removeLayer(layer)
      }
    })
    // 请求点击地区的边界线
    let adcode = featureStore.currentAdcodeMousemove
    const layerWithBorderNextLevel = await mapStore.getLayerWithPolygonByAdcodeByAliyun(adcode)
    layerWithBorderNextLevel.set('name', 'layerWithBorderNextLevel') // 设置图层名称，方便后续移除
    map.addLayer(layerWithBorderNextLevel)
  }
)
</script>
