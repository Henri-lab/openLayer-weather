import Instance from './Instance'

const key = '030f480ba89c9b9bf9efe99c5f98c7a0'

// 天气查询------------------------------------------------
const getLocal = async () => {
    try {
        const res = await Instance.get(`/ip?key=${key}`)
        // console.log('{getLocal/api}','return:',res)
        return res.data
    } catch (error) {
        console.error('Error request data:', error)
        return 0
    }
}

const getAdcode = async (city) => {
    try {
        // console.log('adcode查询~city:',city)
        const res = await Instance.get(`/geocode/geo?key=${key}&address=${city}`)
        // console.log('{getAdcode/api}','return:',res)
        return res
    } catch (error) {
        console.error('Error request data:', error)
        return 0
    }
}

const getWeatherPrediction = async (adcode) => {
    try {
        const res = await Instance.get(`/weather/weatherInfo?key=${key}&city=${adcode}&extensions=all`)
        // console.log('{getWeatherPrediction/api}','return:',res)
        return res
    } catch (error) {
        console.error('Error request data:', error)
        return 0
    }
}

const getWeatherLive = async (adcode) => {
    try {
        const res = await Instance.get(`/weather/weatherInfo?key=${key}&city=${adcode}&extensions=base`)
        // console.log('{getWeatherLive/api}','return:',res)
        return res
    } catch (error) {
        console.error('Error request data:', error)
        return 0
    }
}

export { getLocal, getAdcode, getWeatherPrediction, getWeatherLive }

