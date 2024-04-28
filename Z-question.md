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