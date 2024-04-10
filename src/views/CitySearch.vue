<template>
  <div class="search">
    <input
      type="text"
      placeholder="请输入城市名称"
      class="input"
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
              <button class="check" @click="checkCity(item)">查看</button>
              <button class="delete" @click="delCity(item.cityName)">删除</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useWeatherInfoStore } from '../stores/weatherInfoStore'
import { useSearchStore } from '@/stores/searchStore'
import { useRouter } from 'vue-router'

const store = useWeatherInfoStore()
const store2 = useSearchStore()
const router = useRouter()
const document = window.document

const value = ref('')
const isShow = ref(false) //控制input框是否高亮
const isShow2 = ref(-1) //控制表格操作btn是否挂载
const isShow3 = ref(false) //控制select是否展开
const cityName = ref('')
const ableWatch = ref(0) //watch 标志位

onMounted(() => {
  // 刷新页面加载已经添加的城市
  store2.getlocalStorage()
  document.addEventListener('click', active)
})

const list = computed(() => store2.cityList)

// enWatch help合理化watch频率
const enWatch = () => {
  ableWatch.value = 1
}
//根据输入框内容返回城市fullName
watch(
  () => value.value,
  (city_input_new) => {
    if (ableWatch.value) {
      //可以回调,查找输入城市的相关信息
      console.log('搜索组件调用')
      store.getCityAdcode(city_input_new).then(() => {
        if (store.cityAdcode) {
          // 根据输入的城市名称找到了adcode,城市fullName
          cityName.value = store.cityName
          // 展开查询界面
          isShow3.value = true
        } else {
          console.log('match error')
          // 展开查询界面
          cityName.value = '似乎没有找到你查找的城市'
          isShow3.value = true
          //一段时间后关闭查询界面
          setTimeout(() => {
            isShow3.value = false
          }, 5000)
        }
      })
      // ableWatch.value = 0
    }
  }
)

//点击输入表单的城市选项跳转到相应城市的weatherLive

//在路由中记录查看城市的名称和adcode
//@store1更新时间：在搜索表单返回城市的fullName之前一丢丢
//没有找到您输入的城市时，已经在store1中设置为:cityName、adcode置为 '' ；
const search = () => {
  if (!store.cityName)
    // 没搜索到了对应的城市
    alert('>_< 就不要为难人家了啦~~~~')
  else {
    //搜到了
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
}

const checkCity = (item) => {
  // 跳转到相应城市的weatherLive
  store.getCityAdcode(item.cityName).then(() => {
    router.push({
      name: 'live',
      params: {
        adcode: item.adcode,
        cityName: item.cityName
      },
      query: {
        cityName: item.cityName
      }
    })
  })
}

const delCity = (cityName) => {
  store2.del(cityName)
  store2.setlocalStorage()
  store2.getlocalStorage()
  console.log('已经更新城市页面')
}

//输入框样式
const active = (e) => {
  //如果你点击的是input框
  if (e.target.classList.contains('input')) {
    isShow.value = true
  } else {
    isShow.value = false
    // 顺便把select也~~
    isShow3.value = false
  }
}

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
    height: 0;
    overflow-y: hidden;
  }
  .select.expand {
    width: 100%;
    height: auto;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    //优化：自适应高度
    overflow-y: scroll;
    background-color: rgba(7, 179, 236, 0.5);
    margin-top: -10px;
    .cityName {
      width: 100%;
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
            width: auto;
            position: absolute;
            top: 2px;
            left: 1%;
          }
          .temp {
            width: auto;
            position: absolute;
            top: 2px;
            right: 1%;
          }
          .operate {
            display: flex;
            position: absolute;
            left: 53.5em;
            background-color: rgb(0, 47, 61) !important;
            button {
              width: 50px;
              height: 25px;
              margin-right: 4px;
              background-color: rgb(102, 84, 3);
              border: 0;
            }
            .check:hover {
              color: blue;
            }
            .delete:hover {
              color: red;
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
