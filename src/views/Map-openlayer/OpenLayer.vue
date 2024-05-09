<template>
  <div class="openlayer"></div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { useFeatureStore } from '@/stores/featureStore'
import { onMounted, watch, inject } from 'vue'
import sleep from '@/util/sleep'

const mapStore = useMapStore()
const featureStore = useFeatureStore()
let $map = null
const app = inject('app')
const isOnMounted = ref(false)

// 挂载立即请求省级边界
// 添加省级边界的图层并设置名称
// 鼠标探测是否有矢量元素，如果有就改变cursor样式
// 监听地图的缩放事件
onMounted(() => {
  $map = app.config.globalProperties.$map
  if ($map) {
    $map.on('pointermove', function (e) {
      let pixel = $map.getEventPixel(e.originalEvent)
      let hit = $map.hasFeatureAtPixel(pixel)
      $map.getTargetElement().style.cursor = hit ? 'pointer' : ''
    })
    $map.getView().on('change:resolution', function (e) {
      let currentZoom = $map.getView().getZoom()
      mapStore.currentZoom = parseInt(currentZoom)
    })
    isOnMounted.value = true
  }
})

// 组件挂载后申请低level图层
watch(
  () => isOnMounted.value,
  async () => await loadLayerWithFeature(100000)
)

// 当点击某个不同的高level矢量元素时
// 移除先前添加的低level图层
// 请求点击地区的图层(带矢量)
// 添加此图层并设置名称
watch(
  () => featureStore.currentAdcodeMouseClick,
  async () => {
    alert('您即将进入下一级区划')

    $map.getLayers().forEach((layer) => {
      if (layer.get('name') === 'layerWithBorderNextLevel') {
        $map.removeLayer(layer)
      }
    })

    let adcode = featureStore.currentAdcodeMouseClick
    const layerWithBorderNextLevel = await mapStore.getLayerWithPolygonByAdcodeByAliyun(
      'chinaNextlevelBorder',
      adcode,
      {}
    )
    layerWithBorderNextLevel.set('name', 'layerWithBorderNextLevel')
    $map.addLayer(layerWithBorderNextLevel)
  }
)

// method
async function loadLayerWithFeature(adcode) {
  const layerWithBorderProvince = await mapStore.getLayerWithPolygonByAdcodeByAliyun(
    'defaultLayerWithFeature',
    adcode,
    { wrapX: false }
  )
  adcode === 100000 && layerWithBorderProvince.set('name', 'layerWithBorderProvince')
  $map.addLayer(layerWithBorderProvince)
}
</script>
