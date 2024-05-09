<!-- open-map vue ...-->
<!-- Uncaught (in promise) TypeError: Cannot create property 'innerHTML' on string 'txt' -->

<template>
      <span
        class="count"
        @click="positionOnce"
        @mouseover="isHover = 1"
        @mouseleave="isHover = 0"
        ref="txt"
        >???</span
      >
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'


//

// user城市

// ol data

//

const eleTxt = ref('txt')
const isHover = ref(-1)

// method---------------------------

// 这里面有逻辑错误：执行manu之后已经txt是新的；执行auto时会二次执行manu会仍拿到新的，所以移走鼠标不会改变视图;
// return await 造成的其他问题
// Solurion:temp 在本vue中公共管理
// nextTick 在这里可以去掉
async function manuTxt() {
  const tempTxt = eleTxt.value.innerHTML //❌
  eleTxt.value.innerHTML = '立即定位'
  await nextTick()
  return tempTxt
}
async function autoTxt() {
  const tempTxt = manuTxt()
  eleTxt.value.innerHTML = tempTxt
  await nextTick()
}

// onMounted---------------------------

watch(isHover, async () => {
  // 确保eleTxt已经mounted
  if (eleTxt) {
    switch (isHover.value) {
      case 0:
        await autoTxt()
        break
      case 1:
        await manuTxt()
        break
      default:
        break
    }
  }
})
