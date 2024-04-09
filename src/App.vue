<script setup>
import NaviHead from './components/NaviHead.vue'
import WeatherPrediction from './components/WeatherPrediction.vue'

</script>

<template>
  <div id="app">
    <div class="box">
       <NaviHead/>
       <router-view name="search"/>
       <WeatherPrediction/>
    </div>
   
  </div>
</template>

<style lang="scss">
*{
  margin:0;
  padding: 0;
  box-sizing: border-box;
}
.box{
  height: 700px;
  background-color: rgba(0, 82, 110, 0.3);
}
</style>
