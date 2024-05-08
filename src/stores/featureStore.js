
import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useFeatureStore = defineStore('FeatureStore', () => {

    let currentAdcodeMousemove = ref(0)
    let currentAdcodeMouseClick= ref(0)
    
    return {
        currentAdcodeMousemove,
        currentAdcodeMouseClick,
    }
})