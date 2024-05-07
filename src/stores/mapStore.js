import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getFeaturesByAliyun } from '@/api'

export const useMapStore = defineStore('MapStore', () => {
    // Data-----------------------------
    // --zoom (default:5)
    // --longitude(default:116.404)
    // --latitude(default:39.915)
    // --defaultCity(default:'天安门')
    const defaultZoom = 4
    const defaultJing = 105.00
    const defaultWei = 35.00
    const defaultCity = '中国'
    const longtitude = ref(defaultJing)
    const latitude = ref(defaultWei)
    const zoom = ref(defaultZoom)
    const currentZoom = ref(defaultZoom)


    // --openLayer objects
    const gdXYZ = new ol.source.XYZ({
        title: 'gdXYZ',
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: false,
    })
    const gdTile = new ol.layer.Tile({
        title: 'gd',
        source: gdXYZ,
    })
    let defaultView = new ol.View({
        center: ol.proj.fromLonLat([longtitude.value, latitude.value]),
        zoom: zoom.value,
        minZoom: 3
    })
    let $layerSetStyle = ref(null)
    // 地图
    let $map = null


    // Func-----------------------------
    // 是否已经定位
    const isPosition = () => {
        return !(longtitude.value === defaultJing && latitude.value === defaultWei)
    }
    // 获取阿里云的图层数据
    const getUrlAliyun = (adcode) => {
        return `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}_full`
    }
    const getLayerWithPolygonByAdcodeByAliyun = async (adcode) => {
        const layerWithPolygonByAliyun = new ol.layer.Vector({
            title: 'borderLayer',
            source: await new ol.source.Vector({
                title: 'borderSource',
                url: getUrlAliyun(adcode),
                format: new ol.format.GeoJSON(),
                wrapX: true,
            }),
        })
        $layerSetStyle.value = layerWithPolygonByAliyun
        return layerWithPolygonByAliyun
    }

    const getSourceWithPolygonByAdcodeByAliyun = async (adcode) => {
        const features = new ol.format.GeoJSON().readFeatures(getFeaturesByAliyun(adcode));
        let source = new ol.source.Vector({
            title: 'borderSource',
            wrapX: true,
        })
        source.addFeatures(features)
        return source
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
        currentZoom,
        longtitude,
        latitude,
        $layerSetStyle,
        isPosition,
        getUrlAliyun,
        getLayerWithPolygonByAdcodeByAliyun,
        getSourceWithPolygonByAdcodeByAliyun,
    }
})