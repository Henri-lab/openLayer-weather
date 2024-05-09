
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFeaturesByAdcodeByAliyun } from '@/api'


export const useFeatureStore = defineStore('FeatureStore', () => {

    let currentAdcodeMousemove = ref(0)
    let currentAdcodeMouseClick = ref(0)


    // 根据adcode请求一个features数组
    const getNextLevelByAdcode = async (adcode) => {
        const features = await getFeaturesByAdcodeByAliyun(adcode);
        return features;
    }


    return {
        currentAdcodeMousemove,
        currentAdcodeMouseClick,
        getNextLevelByAdcode,
    }
})