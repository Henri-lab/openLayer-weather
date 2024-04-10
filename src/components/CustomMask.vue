<template>
    <!-- 遮罩 -->
  <div class="custom-mask"></div>
</template>

<script setup></script>

<style lang="scss" scoped>
.custom-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(153, 229, 229);
  opacity: 10%;
  z-index:-1;
}
</style>
