import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', () => {
    
    //dialoge
    const dialogVisible=ref(false)
    
    //输入框的边框
    const inputBorder = ref(false)
    const deactive = () => {
        inputBorder.value = false
    }
    const active = () => {
        inputBorder.value = true
    }
    //添加的城市
    //cityList:searched+recorded
    const cityList = ref([])
    const temp = ref('')
    const add = (city_temp) => {
        // 列表已经存在该城市
        if (cityList.value.some(item => (item.cityName === city_temp.cityName))) return
        else cityList.value.push(city_temp)
        inputBorder.value = false
    }
    const del = (city) => {
        cityList.value = cityList.value.filter(item => (item.cityName !== city))
        inputBorder.value = false
    }
    const setTemp = (t) => {
        temp.value = t
    }
    const setlocalStorage = () => {
        //每次都是重新set===先清空再添加 
        localStorage.clear()
        // 
        cityList.value.forEach(item => {
            let key = item.cityName
            let value = JSON.stringify(+item.temp)
            localStorage.setItem(key, value)
        })
    }
    const getlocalStorage = () => {
        for (let i = 0; i < localStorage.length; i++) {
            let cityName = localStorage.key(i)
            let temp = localStorage.getItem(cityName)
            // 好习惯：添加前问一下是否已经存在
            if (cityList.value.some(item => (item.cityName === cityName))) return
            else cityList.value.push({ cityName, temp })
        }
    }
    return {
        dialogVisible,
        inputBorder,
        cityList,
        temp,
        deactive,
        active,
        add,
        del,
        setTemp,
        setlocalStorage,
        getlocalStorage
    }
})