import { setLocalStorageItems, getLocalStorageItemsByPrefix } from './getAndSet'
export default function localStorage(type, predix, souceArr, resultArray) {
    if (type ==='set') {
        setLocalStorageItems(predix, souceArr)
    } else if (type === 'get') {
        resultArray = getLocalStorageItemsByPrefix(predix,resultArray)
    }
    return resultArray
}