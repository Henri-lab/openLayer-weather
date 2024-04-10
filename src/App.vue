<script setup>
import CustomMask from './components/CustomMask.vue'
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

  <el-dialog
    v-model="dialogVisible"
    width="200"
    class="custom-dialog"
    z-index="100"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <CustomMask />
    <span class="alertInfo">
      <h3 class="title">关于：</h3>
      <p>这个应用可以用来追踪你选择城市的当前天气 如何使用:</p>

      <h3>如何使用:</h3>
      <p>1.点击搜索框输入你希望追踪的城市</p>
      <p>2.在搜索结果中选中一个城市，你将获取当地最新的天气</p>
      <p>3.点击右侧的＋号可以将追踪城市的天气情况保存在首页 移除城市:</p>

      <h3>移除城市:</h3>
      <p>如果你不想在首页关注某个城市,可以通过底部的按钮删除它</p>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="close" @click="store2.dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.alertInfo {
  color: aliceblue;
  font-size: 8px;
}

.title {
  margin-top: -10px;
}

h3 {
  color: white;
  font-size: 14px;
  font-weight: lighter;
  margin-top: 10px;
}

#app{
  height: 900px;
}

.box {
  height: 100%;
  background-color: rgba(0, 82, 110, 0.3);
}

.custom-dialog {
  background-color: rgba(15, 9, 9, 0.3);
  margin-top: 100px;
  height: 220px;
  padding: 5px;
}

.close {
  width: 40px;
  height: 20px;
  color: white;
  font-size: 10px;
  font-weight: lighter;
  background-color: rgb(25, 131, 230);
  opacity: 50%;
}

.dialog-footer{
  opacity: 50%;
  position: absolute;
  top: 190px;
}
</style>
