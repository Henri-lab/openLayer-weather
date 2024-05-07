// 1.觸發事件對象 e
// 2.輸入地圖和你想操作的圖層名稱 $map, layerName;
// 3.如果你指定了index:
// --那麽你所mousemove的位置有features的話則返回第index個;反之則返回NULL;
// 4.cb回調獲得全部的featuresAtPixel數組
function cb() { }
function getFeatureAtPixel(e, $map, layerName, index, cb) {
    let featureByIndex = null
    let featureArr = []
    const pixel = $map.getEventPixel(e.originalEvent)
    if (pixel) {
        // mousemove到有feature的區域
        // 獲取name為layerName的圖層的features數組
        let i = 0
        $map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            if (layer.get('name') === layerName) {
                featureArr.push(feature)
                cb(featureArr)
                i++
            }
        })
        // 如果指定index且合法則返回featuresAtPixel數組中的第index個元素
        // 如果指定index大於featuresAtPixel數組長度則返回null
        if (typeof index === 'number') {
            if (i === index) {
                featureByIndex = feature;
            } else if (index > featureArr.length-1 || index < 0) {
                console.log(`Invalid index when getfeatureAtPixel in ${layerName} layer`);
                featureByIndex = null;
            }
        }
        // mousemove到沒有feature的區域
        if (!$map.forEachFeatureAtPixel(pixel, () => true) || featureArr.length === 0) {
            console.log(`no featureAtPixel yet when getfeatureAtPixel in ${layerName} layer`)
            return null
        }
        return featureByIndex
    } else console.log('getEventPixel fail')
}



export { getFeatureAtPixel }