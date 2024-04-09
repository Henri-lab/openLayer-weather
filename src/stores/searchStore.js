import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', () => {
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
    return {
        inputBorder,
        cityList,
        temp,
        deactive,
        active,
        add,
        del,
        setTemp
    }
})