import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCityHotStore = defineStore('CityHotStore', () => {
    // city:{ "id","spell,"name"}

    const currentCity = ref('')
    const positionCity = ref('')
    const cityVisitedList = ref([])//最近访问-本地存储
    const hotCityList = ref([])//热门城市

    const isExist = (city) => {
        return cityVisitedList.value.some(item => (item.name === city))
    }
    const add = (city) => {
        if (cityVisitedList.value.some(item => (item.name === city))) return
        else cityVisitedList.value.push(city)
    }
    const del = (city) => {
        cityVisitedList.value = cityVisitedList.value.filter(item => (item.name !== city))
    }
    const deleteLocalStorageItemsContaining = (searchString) => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes(searchString)) {
                localStorage.removeItem(key);
                i--;//💥
            }
        }
    }
    const setlocalStorage = () => {
        deleteLocalStorageItemsContaining('cityVisitedMoudle-')
        cityVisitedList.value.forEach(item => {
            let key = 'cityVisitedMoudle-' + item.id
            let value = JSON.stringify({ item })
            localStorage.setItem(key, value)
        })
    }
    const getlocalStorage = () => {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).includes('cityVisitedMoudle-')) {
                let cityVisitedMoudleIndex = localStorage.key(i)
                let id = cityVisitedMoudleIndex.replace('cityVisitedMoudle-', '')
                let name = JSON.parse(localStorage.getItem(cityVisitedMoudleIndex)).name
                let spell = JSON.parse(localStorage.getItem(cityVisitedMoudleIndex)).spell
                if (cityVisitedList.value.some(item => (item.name === name))) return
                else cityVisitedList.value.push({ id, name, spell })
            }
        }
    }
}) 