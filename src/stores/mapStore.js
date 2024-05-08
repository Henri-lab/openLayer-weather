
import { defineStore } from 'pinia'
import { getFeaturesByAliyun } from '@/api'
import { ref } from 'vue'

export const useMapStore = defineStore('MapStore', () => {
    // Data-----------------------------
    // --zoom (default:5)
    // --longitude(default:116.404)
    // --latitude(default:39.915)
    // --defaultCity(default:'天安门')
    const defaultLon = 105.00
    const defaultLat = 35.00
    const defaultCity = '中国'
    const longtitude = ref(defaultLon)
    const latitude = ref(defaultLat)
    const zoom = ref(4)
    const currentZoom = ref(4)
    const minZoom = ref(3)
    const animateZoom = ref(15)
    const animateDuration = ref(2000)


    // --openLayer objects options
    const gdXYZ_title = ref('gdXYZ')
    const gdXYZ_url = ref('http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}')
    const gdXYZ_wrapX = ref(false)
    const gdTile_title = ref('gd')
    // --openLayer objects
    let gdXYZ = new ol.source.XYZ({
        title: gdXYZ_title.value,
        url: gdXYZ_url.value,
        wrapX: gdXYZ_wrapX.value
    })
    let gdTile = new ol.layer.Tile({
        title: gdTile_title.value,
        source: gdXYZ
    })
    let defaultView = new ol.View({
        center: ol.proj.fromLonLat([longtitude.value, latitude.value]),
        zoom: zoom.value,
        minZoom: minZoom.value
    })
    let $map = null

    // Func-----------------------------
    async function loadMap(title, target) {
        try {
            return new ol.Map({
                title,
                target,
                view: defaultView,
                layers: [gdTile]
            });
        }catch (e) {
            console.error('loadMap fail',e)
            return null
        }
    }

    // 是否已经定位
    const isPosition = () => {
        return !(longtitude.value === defaultLon && latitude.value === defaultLat)
    }
    // 获取阿里云的图层数据
    const getUrlAliyun = (adcode) => {
        return `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}_full`
    }

    let index = 0
    const getLayerWithPolygonByAdcodeByAliyun = async (title, adcode, { wrapX, opacity, visible, zIndex, style }) => {
        const layerWithPolygonByAliyun = new ol.layer.Vector({
            title: title || `borderLayer-${index++}`,
            source: await new ol.source.Vector({
                title: `borderSource-${index++}`,
                url: getUrlAliyun(adcode),
                format: new ol.format.GeoJSON(),
                wrapX: wrapX || false,
                opacity: opacity,
                visible: visible || true,
                zIndex: zIndex || 0,
                style: style || {}
            }),

        })
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
        animateZoom,
        animateDuration,
        defaultLon,
        defaultLat,
        gdXYZ_title,
        gdXYZ_url,
        gdXYZ_wrapX,
        gdTile_title,
        defaultCity,
        zoom,
        minZoom,
        currentZoom,
        longtitude,
        latitude,
        loadMap,
        isPosition,
        getUrlAliyun,
        getLayerWithPolygonByAdcodeByAliyun,
        getSourceWithPolygonByAdcodeByAliyun,
    }
})