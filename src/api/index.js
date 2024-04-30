import Instance from './Instance'

// const key = '030f480ba89c9b9bf9efe99c5f98c7a0'
const key ='15ac89d2e97769c345aa9be687d7bec3'
// const key ='4901b64d10fa26f30af3850ba1b9ad65'

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

//地理/逆地理编码------------------------------------------------

//res.data 示例
{
    // "status": "1",
    // "regeocode": {
    //     "addressComponent": {
    //         "city": "武汉市",
    //         "province": "湖北省",
    //         "adcode": "420115",
    //         "district": "江夏区",
    //         "towncode": "420115020000",
    //         "streetNumber": {
    //             "number": "1号",
    //             "location": "114.408600,30.458861",
    //             "direction": "西北",
    //             "distance": "90.4667",
    //             "street": "大学园路"
    //         },
    //         "country": "中国",
    //         "township": "关东街道",
    //         "businessAreas": [
    //             []
    //         ],
    //         "building": {
    //             "name": [],
    //             "type": []
    //         },
    //         "neighborhood": {
    //             "name": "万科城市花园(万科红郡东)",
    //             "type": "商务住宅;住宅区;住宅小区"
    //         },
    //         "citycode": "027"
    //     },
    //     "formatted_address": "湖北省武汉市江夏区关东街道万科城市花园(万科红郡东)万科城市花园上西10区"
    // },
    // "info": "OK",
    // "infocode": "10000"
}
const regeoByCoordinates = async (lon, lat, prop) => {
    try {
        const res = await Instance.get(`/geocode/regeo?location=${lon},${lat}&key=${key}`);
        if (res.data.status === '1' && res.data.regeocode.addressComponent) {
            switch (prop) {
                case 'city':
                    if (res.data.regeocode.addressComponent.city) {
                        console.log('city success:',res.data.regeocode.addressComponent.city)
                        return res.data.regeocode.addressComponent.city;
                    }
                    else
                        break;
                case 'adcode':
                    if (res.data.regeocode.addressComponent.adcode)
                        return res.data.regeocode.addressComponent.adcode;
                    break;
                case 'province':
                    if (res.data.regeocode.addressComponent.province)
                        return res.data.regeocode.addressComponent.province;
                    break;
                case 'district':
                    if (res.data.regeocode.addressComponent.district)
                        return res.data.regeocode.addressComponent.district;
                    break;
                case 'township':
                    if (res.data.regeocode.addressComponent.township)
                        return res.data.regeocode.addressComponent.township;
                    break;
                case 'citycode':
                    if (res.data.regeocode.addressComponent.citycode)
                        return res.data.regeocode.addressComponent.citycode;
                    break;
                case 'country':
                    if (res.data.regeocode.addressComponent.country)
                        return res.data.regeocode.addressComponent.country;
                    break;
                case "streetNumber":
                    if (res.data.regeocode.addressComponent.streetNumber)
                        return res.data.regeocode.addressComponent.streetNumber;
                    break;
                case "towncode":
                    if (res.data.regeocode.addressComponent.towncode)
                        return res.data.regeocode.addressComponent.towncode;
                    break;
                case 'building':
                    if (res.data.regeocode.addressComponent.building)
                        return res.data.regeocode.addressComponent.building;
                    break;
                case 'neighborhood':
                    if (res.data.regeocode.addressComponent.neighborhood)
                        return res.data.regeocode.addressComponent.neighborhood;
                    break;
                case 'businessAreas':
                    if (res.data.regeocode.addressComponent.businessAreas)
                        return res.data.regeocode.addressComponent.businessAreas;
                    break;
                case 'formattedAddress':
                    if (res.data.regeocode.formatted_Address)
                        return res.data.regeocode.formatted_Address;
                    break;
                default:
                    if (res.data.regeocode.addressComponent.city)
                        return res.data.regeocode.addressComponent.city;
                    break;
            }
            return 0;
        }
        else throw new Error(`高德-逆地理-失败`);
    } catch (error) {
        console.error('请求高德地图API失败:', error);
    }
}


export { getLocal, getAdcode, getWeatherPrediction, getWeatherLive, regeoByCoordinates }

