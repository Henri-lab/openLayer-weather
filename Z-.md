```javascript
//对变量先ref后computed会出问题~~~

//用await会解决用then出现的异步陷阱

//想给store的异步方法加锁，是否多此一举

// watchEffect和computed感觉选择困难

// 引起❌:
const requestLive = async () => {
  console.log('头部组件调用')
  weatherInfoStore.getLocalInfo().then(() => {
    console.log('头部组件调用')
    weatherInfoStore.getCityAdcode(weatherInfoStore.local).then(() => {
      console.log('头部组件调用')
      adcode.value = weatherInfoStore.cityAdcode
      weatherInfoStore.getWeatherLiveInfo(weatherInfoStore.cityAdcode)
    })
  })
}
```

1.  ref('htmlelement') 返回的是响应对象
2.  改完innerTxt maybe强制重绘
3.  从pinia返回的state不是响应对象，但state有响应性
4.  ref 定义响应定义引用要在对的位置