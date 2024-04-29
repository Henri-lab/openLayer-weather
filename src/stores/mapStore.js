import { ref } from 'vue'
import { defineStore } from 'pinia'

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
        isPosition,
    }
})