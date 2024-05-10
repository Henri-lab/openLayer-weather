<template>
  <div class="openlayer"></div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { useFeatureStore } from '@/stores/featureStore'
import { ref, onMounted, watch, inject } from 'vue'
import sleep from '@/util/sleep'

const mapStore = useMapStore()
const featureStore = useFeatureStore()
let $map = null
const app = inject('app')
const isOnMounted = ref(false)
const isMapCilcked = ref(false)

// 挂载立即请求省级边界
// 添加省级边界的图层并设置名称
// 鼠标探测是否有矢量元素，如果有就改变cursor样式
// 监测地图点击事件的发生
// 监听地图的缩放事件
onMounted(() => {
  $map = app.config.globalProperties.$map
  if ($map) {
    $map.on('pointermove', function (e) {
      let pixel = $map.getEventPixel(e.originalEvent)
      let hit = $map.hasFeatureAtPixel(pixel)
      $map.getTargetElement().style.cursor = hit ? 'pointer' : ''
    })
    $map.on('click', async function (e) {
      isMapCilcked.value = true
      await sleep(1)
      isMapCilcked.value = false
    })
    $map.getView().on('change:resolution', function (e) {
      let currentZoom = $map.getView().getZoom()
      mapStore.currentZoom = parseInt(currentZoom)
    })
    isOnMounted.value = true
  }
})

// 组件挂载后申请高level图层
watch(
  () => isOnMounted.value,
  async () =>
    await mapStore.loadLayerWithPolygonByAdcodeByAliyun(
      100000,
      'provincePolygon_aliyun',
      'layerLevel'
    )
)

// 当move并click某个不同的高level矢量元素时
// 移除先前添加的低level图层
// 请求点击地区的图层(带矢量)
// 添加此图层并设置名称
watch(
  () => featureStore.currentAdcodeLevel,
  async () => {
    if (isMapCilcked) {
      let adcodeLevel = featureStore.currentAdcodeLevel
      await mapStore.loadUniqueLayerWithPolygonByAdcodeByAliyun(adcodeLevel, 'layerNextLevel')
    }
  }
)

// method
</script>
