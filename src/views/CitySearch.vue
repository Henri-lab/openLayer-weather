<template>
  <div class="search">
    <input
      type="text"
      placeholder="请输入城市名称"
      class="input"
      @click="active"
      :class="{ active: isShow }"
      v-model="value"
      @input="enWatch"
    />
    <div class="select" :class="{ expand: isShow3 }">
      <!-- 假如只返回一个城市 -->
      <div class="cityName" @click="search">{{ cityName }}</div>
    </div>
    <div class="list">
      <ul>
        <li
          @mouseenter="select(index)"
          @mouseleave="cancel()"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="record">
            <div class="topo">{{ item.cityName }}</div>
            <div class="temp">{{ item.temp }}度</div>
            <div class="operate" v-if="isShow2 === index">
              <button class="check" @click="checkCity(item.cityName)">查看</button>
              <button class="delete" @click="delCity(item.cityName)">删除</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, watch, computed /* onMounted */ } from 'vue'
import { useWeatherInfoStore } from '../stores/weatherInfoStore'
import { useSearchStore } from '@/stores/searchStore'
import { useRouter } from 'vue-router'

const store = useWeatherInfoStore()
const store2 = useSearchStore()
const router = useRouter()

const value = ref('')
const isShow = ref(false) //控制input框是否高亮
const isShow2 = ref(-1) //控制表格操作btn是否挂载
const isShow3 = ref(false) //控制note是否展开
const cityName = ref('')
const ableWatch = ref(0) //watch 标志位

const list = computed(() => store2.cityList)

// enWatch help合理化watch频率
const enWatch = () => {
  ableWatch.value = 1
}
//根据输入框内容搜索城市
//需要优化：~~~~
watch(
  () => value.value,
  (newValue) => {
    if (ableWatch.value) {
      //可以回调,查找输入城市的相关信息
      console.log('搜索组件调用~code')
      store.getCityAdcode(newValue).then(() => {
        if (store.cityAdcode) {
          // 根据输入的城市名称找到了adcode,找到了完整城市名称
          cityName.value = store.cityName
          // 展开查询界面
          isShow3.value = true
          //一段时间后关闭查询界面
          setTimeout(() => {
            isShow3.value = false
          }, 5000)
        } else {
          console.log('match error')
          // 展开查询界面
          isShow3.value = true
          cityName.value = '似乎没有找到你查找的城市'
        }
      })
      ableWatch.value = 0
    }
  }
)

//点击城市选项跳转到相应城市的weatherLive
const search = () => {
  router.push({
    name: 'live',
    params: {
      adcode: store.cityAdcode,
      cityName: store.cityName
    },
    query: {
      cityName: store.cityName
    }

  })
}

const checkCity = (cityName) => {
  // 跳转到相应城市的weatherLive
  let code = ''
  store.getCityAdcode(cityName).then(() => {
    code = store.cityAdcode
    console.log('code=', code)
    router.push({
      name: 'live',
      params: {
        adcode: code,
        cityName: cityName
      },
      query: {
        cityName: cityName
      }
    })
  })
}

const delCity = (cityName) => {
  store2.del(cityName)
}

//输入框样式
const active = () => {
  store2.active()
  //   console.log('下边框颜色激活',isShow.value)
}
watchEffect(() => {
  isShow.value = store2.inputBorder
})

//列表操作挂载
const select = (index) => {
  isShow2.value = index
}
const cancel = () => {
  isShow2.value = -1
}
</script>

<style lang="scss" scoped>
.search {
  width: 960px;
  margin: 0 auto;
  //   background-color: aqua;
  .input {
    width: 100%;
    height: 30px;
    border: 0;
    border-bottom: 1px solid grey;
    background-color: rgba(0, 82, 110, 0);
    padding: 8px, 4px;
    margin: 15px 0;
    outline: none;
  }
  .select {
    height: 0px;
    overflow-y: hidden;
  }
  .select.expand {
    width: 100%;
    height: auto;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    //优化：自适应高度
    overflow-y: scroll;
    background-color: rgba(0, 82, 110, 0.5);
    margin-top: -10px;
    .cityName {
      font-size: 14px;
    }
    .cityName:hover {
      background-color: yellow;
    }
  }

  .active {
    border-bottom-color: deepskyblue;
  }
  .list {
    width: 960px;
    ul {
      width: 100%;
      list-style: none;
      li {
        width: 100%;
        // background-color: red;
        .record {
          width: 100%;
          height: 25px;
          margin: 5px 0;
          background-color: rgba(0, 82, 110, 0.5);
          position: relative;
          animation: growWidth 1s forwards;
          .topo {
            width: 15%;
            position: absolute;
            left: 5px;
          }
          .temp {
            width: 15%;
            position: absolute;
            right: -50px; //?????????????
          }
          .operate {
            position: fixed;
            right: 280px;
            button {
              width: 50px;
              height: 24px;
              margin-right: 4px;
              background-color: darkolivegreen;
              border: 0;
            }
          }
        }
        .record:hover {
          width: 80%;
          margin-left: 0;
          animation: fadeWidth 1s forwards;
        }
        @keyframes growWidth {
          from {
            width: 80%;
          }
          to {
            width: 100%;
          }
        }
        @keyframes fadeWidth {
          from {
            width: 100%;
          }
          to {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>
