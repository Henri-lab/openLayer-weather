import { ref } from 'vue'
import { defineStore } from 'pinia'
import localStorageManager from '@/util/localStorageManager'

export const useSearchStore = defineStore('SearchStore', () => {

    //dialoge
    const dialog = ref(false)

    //添加的城市
    //cityList:searched+recorded
    const cityList = ref([])
    const temp = ref('')
    const adcode = ref('')
    const isfirst = ref(0)//判断是否首次添加

    // 判断是否已经存在
    const isExist = (cityName) => {
        return cityList.value.some(item => (item.cityName === cityName))
    }

    const add = (city) => {
        // 列表已经存在该城市
        if (cityList.value.some(item => (item.cityName === city.cityName))) return
        else cityList.value.push(city)
    }
    const del = (cityName) => {
        cityList.value = cityList.value.filter(item => (item.cityName !== cityName))
    }
    const setTemp = (t) => {
        temp.value = t
    }
    const setAdcode = (c) => {
        adcode.value = c
    }
    // 本地存储
    const getlocalStorage = () => {
        cityList.value = []  // 🚩
        localStorageManager('get', 'searchWeatherLiveMoudle-', cityList.value)
    }
    const setlocalStorage = () => {
        localStorageManager('set', 'searchWeatherLiveMoudle-', cityList.value)
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