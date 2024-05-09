<template>
  <div class="openlayer"></div>
</template>

<script setup>
import { useMapStore } from '@/stores/mapStore'
import { useFeatureStore } from '@/stores/featureStore'
import { onMounted, watch ,inject} from 'vue'
import sleep from '@/util/sleep'

const mapStore = useMapStore()
const featureStore = useFeatureStore()
let $map = null

// 挂载立即请求省级边界
// 添加省级边界的图层并设置名称
// 鼠标探测是否有矢量元素，如果有就改变cursor样式
// 监听地图的缩放事件
onMounted(async () => {
  const app = inject('app')
  $map = app.config.globalProperties.$map
  if ($map) {
    const layerWithBorderProvince = await mapStore.getLayerWithPolygonByAdcodeByAliyun(
      'chinaProvincesBorder',
      100000,
      {}
    )
    layerWithBorderProvince.set('name', 'layerWithBorderProvince')
    $map.addLayer(layerWithBorderProvince)

    $map.on('pointermove', function (e) {
      let pixel = $map.getEventPixel(e.originalEvent)
      let hit = $map.hasFeatureAtPixel(pixel)
      $map.getTargetElement().style.cursor = hit ? 'pointer' : ''
    })

    $map.getView().on('change:resolution', function (e) {
      let currentZoom = $map.getView().getZoom()
      mapStore.currentZoom = parseInt(currentZoom)
    })
  }
})

// 当点击某个矢量元素时(overlayer--)
// 移除先前添加的部分图层
// 请求点击地区的边界线
// 添加带矢量元素的图层并设置名称
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
</script>
