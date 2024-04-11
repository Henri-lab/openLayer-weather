import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('store2', () => {

    //dialoge
    const dialog = ref(false)

    //添加的城市
    //cityList:searched+recorded
    const cityList = ref([])
    const temp = ref('')
    const adcode = ref('')
    const isfirst = ref(0)//判断是否首次添加

    // 判断是否已经存在
    const isExist = (city) => {
        return cityList.value.some(item => (item.cityName === city))
    }

    const add = (city_temp_adcode) => {
        // 列表已经存在该城市
        if (cityList.value.some(item => (item.cityName === city_temp_adcode.cityName))) return
        else cityList.value.push(city_temp_adcode)
    }
    const del = (city) => {
        cityList.value = cityList.value.filter(item => (item.cityName !== city))
    }
    const setTemp = (t) => {
        temp.value = t
    }
    const setAdcode = (c) => {
        adcode.value = c
    }
    // 本地存储
    const setlocalStorage = () => {
        //每次都是重新set===先清空再添加 
        localStorage.clear()
        // 
        cityList.value.forEach(item => {
            let key = item.cityName
            let value = JSON.stringify({ temp: +item.temp, adcode: item.adcode })//*
            localStorage.setItem(key, value)
        })
    }
    const getlocalStorage = () => {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) !== 'login') {
                let cityName = localStorage.key(i)
                let temp = JSON.parse(localStorage.getItem(cityName)).temp//*
                let adcode = JSON.parse(localStorage.getItem(cityName)).adcode//*
                // 好习惯：添加前问一下是否已经存在
                if (cityList.value.some(item => (item.cityName === cityName))) return
                else cityList.value.push({ cityName, temp, adcode })
            }
        }
    }
    return {
        dialog,
        cityList,
        temp,
        adcode,
        isfirst,
        isExist,
        add,
        del,
        setTemp,
        setAdcode,
        setlocalStorage,
        getlocalStorage
    }
})