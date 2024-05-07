import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getFeaturesByAliyun } from '@/api'

export const useFeatureStore = defineStore('FeatureStore', () => {

    let currentAdcodeMousemove = ref(0)
    
    return {
        currentAdcodeMousemove,
    }
})