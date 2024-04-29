import Instance from './Instance'

const key = '030f480ba89c9b9bf9efe99c5f98c7a0'

//地理/逆地理编码
export default async function getCityByCoordinates(lat, lon) {
    try {
        const res = await Instance.get(`/geocode/regeo?output=json&location=${lon},${lat}&key=${key}&radius=1000&extensions=all`);
        if (res.status === '1' && res.regeocode) {
            return data.regeocode.addressComponent.city;
        } else {
            throw new Error('无法获取位置信息');
        }
    } catch (error) {
        console.error('请求高德地图API失败:', error);
    }
}