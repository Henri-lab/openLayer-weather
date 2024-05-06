import { setLocalStorageItems, getLocalStorageItemsByPrefix } from './getAndSet'
// 利用predix来标识item的对象类别
export default function localStorageManager(type, predix, arr) {
    if (type ==='set') {
        // arr为数据源
        setLocalStorageItems(predix, arr)
    } else if (type === 'get') {
        // arr为结果集
        arr = getLocalStorageItemsByPrefix(predix,arr)
        return arr
    }
    
}


// 示例：
// 将students[100]存入localStorage；
// localStorage('set','student-',students[100])

// 将students从localStorage中提取出来，并用result[?]来存储；
// localStorage('get','student-',result[?])

