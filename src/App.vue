<script setup>
import NaviHead from './components/NaviHead.vue'
import WeatherPrediction from './components/WeatherPrediction.vue'
import OpenMap from './components/OpenMap.vue'
import OpenControl from './components/OpenControl.vue'
import { ref, watchEffect } from 'vue'
import { useSearchStore } from './stores/searchStore'
import './main.css'
const searchStore = useSearchStore()
const dialog = ref(false)
watchEffect(() => {
  dialog.value = searchStore.dialog
})
</script>

<template>
  <div id="app">
    <div class="box">
      <NaviHead />
      <router-view name="search" />
      <WeatherPrediction />
      <OpenMap/>
      <!-- <OpenControl/> -->
    </div>
    <div class="dialog">
      <transition name="dialog-fade">
        <el-dialog
          v-model="dialog"
          width="200"
          :show-close="false"
          :close-on-click-modal="false"
          class="dialogELM"
        >
          <span class="alertInfo">
            <h1 class="title">关于：</h1>
            <p>这个应用可以用来追踪你选择城市的当前天气 如何使用:</p>

            <h1>如何使用:</h1>
            <p>1.点击搜索框输入你希望追踪的城市</p>
            <p>2.在搜索结果中选中一个城市，你将获取当地最新的天气</p>
            <p>3.点击右侧的＋号可以将追踪城市的天气情况保存在首页 移除城市:</p>

            <h1>移除城市:</h1>
            <p>如果你不想在首页关注某个城市,可以通过底部的按钮删除它</p>
          </span>
          <template #footer>
            <div class="dialog-footer">
              <el-button class="close" @click="searchStore.dialog = false">关闭</el-button>
            </div>
          </template>
        </el-dialog>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#app {
  height: 2000px;
  .box {
    height: 100%;
    background-color: var(--bcolor);
  }
  .dialog {
    opacity: 60%;

    .dialogELM {
      .alertInfo {
        color: blue;
        font-size: 8px;
        .title {
          margin-top: -20px;
        }
      }
      .dialog-footer {
        opacity: 80%;
        position: absolute;
        top: 190px;
        .close {
          width: 40px;
          height: 20px;
          color: white;
          font-size: 10px;
          font-weight: lighter;
          background-color: black;
          margin-top: -20px;
        }
        .close:hover {
          color: red;
        }
      }
    }
  }
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 2s;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>
