import { ref } from 'vue'
import { defineStore } from 'pinia'
import { regeoByCoordinates } from '@/api'

export const useMapStore = defineStore('MapStore', () => {
    // Data-----------------------------
    // --zoom (default:5)
    // --longitude(default:116.404)
    // --latitude(default:39.915)
    // --defaultCity(default:'天安门')
    const defaultZoom = 15
    const defaultJing = 116.404
    const defaultWei = 39.915
    const defaultCity = '天安门'
    const longtitude = ref(defaultJing)
    const latitude = ref(defaultWei)
    const zoom = ref(defaultZoom)
    // -----反投影后的鼠标经纬坐标-----
    const mouseJing = ref(0)
    const mouseWei = ref(0)
    const mouseCity = ref(null)

    // --openLayer objects
    let $map = null;
    const gdXYZ = new ol.source.XYZ({
        title: 'gdXYZ',
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: true,
    })
    const gdTile = new ol.layer.Tile({
        title: 'gd',
        source: gdXYZ,
    })
    let defaultView = new ol.View({
        center: ol.proj.fromLonLat([longtitude.value, latitude.value]),
        zoom: 15
    })


    // Func-----------------------------
    // 是否已经定位
    const isPosition = () => {
        return !(longtitude.value === defaultJing && latitude.value === defaultWei)
    }
    // API
    const getMouseCity = async (jing, wei) => {
        // 不超过6位小数 api规定
        const city = await regeoByCoordinates(jing, wei, 'city')
        console.log(city)
        city && (mouseCity.value = city)
    }




    return {
        $map,
        gdXYZ,
        gdTile,
        defaultView,
        defaultZoom,
        defaultJing,
        defaultWei,
        defaultCity,
        zoom,
        longtitude,
        latitude,
        mouseJing,
        mouseWei,
        mouseCity,
        isPosition,
        getMouseCity,
    }
})