<script setup>
import NaviHead from './components/NaviHead.vue'
import WeatherPrediction from './components/WeatherPrediction.vue'
import { ref, watchEffect } from 'vue'
import { useSearchStore } from './stores/searchStore'
const store2 = useSearchStore()
const dialogVisible = ref(false)
watchEffect(() => {
  dialogVisible.value = store2.dialogVisible
})
</script>

<template>
  <div id="app">
    <div class="box">
      <NaviHead />
      <router-view name="search" />
      <WeatherPrediction />
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="关于" width="500">
    <span class="alert">
      这个应用可以用来追踪你选择城市的当前天气 如何使用:
      <p>1.点击搜索框输入你希望追踪的城市</p>
      <p>2.在搜索结果中选中一个城市，你将获取当地最新的天气</p>
      <p>3.点击右侧的＋号可以将追踪城市的天气情况保存在首页 移除城市:</p>
      如果你不想在首页关注某个城市,可以通过底部的按钮删 除它
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="store2.dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.7); // 设置遮罩层颜色，并且降低透明度
  opacity: 20%;
}
.box {
  height: 700px;
  background-color: rgba(0, 82, 110, 0.3);
}
</style>
