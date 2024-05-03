<script setup>
import NaviHead from './components/NaviHead.vue'
import WeatherPrediction from './components/WeatherPrediction.vue'
import DialogMark from './components/DialogMark.vue'
import OpenMap from './components/OpenMap.vue'
import OpenControl from './components/OpenControl.vue'
import './main.css'
</script>

<template>
  <div id="app">
    <div class="box">
      <NaviHead />
      <router-view name="search" />
      <WeatherPrediction />
      <OpenMap />
      <OpenControl />
      <transition name="dialog-fade">
        <DialogMark />
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
}
// 🚩not working
// .dialog-fade-enter-active,
// .dialog-fade-leave-active {
//   transition: opacity 2s;
// }
// .dialog-fade-enter-from,
// .dialog-fade-leave-to {
//   opacity: 0;
// }
</style>
