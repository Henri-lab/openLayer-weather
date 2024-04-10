// @更新在头部组件的isShow判断条件
// @更新在头部组件中返回home路由的操作内容



// 添加按钮的显示
// const isShow = computed(() => {
//   // 标记：-设置路径的元数据-提供支持
//   // 如果你去的是live路由，并且你查看live的城市不在cityList中，添加添加键显示；
//   if (route.meta.enabled && !store2.isExist(route.params.cityName)) return true
//   // 如果你去的是live路由，并且你查看live的城市在cityList中，但是是首次添加，添加添加键显示；
//   else if(store2.isExist(route.params.cityName)&&store2.isfirst) return true
//   else return false
// })

// 改变首次添加
// tore2.isfirst=0