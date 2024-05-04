const removeLocalStorageItemsByPrefix = (prefix) => {
    // 从后往前遍历以避免索引问题💥  
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    }
};

function ensureId(obj) {
    if (!obj.hasOwnProperty('id')) {
        obj.id = Date.now();
    }
    return obj;
}

// 使用示例  
let item = { name: 'Apple' };
ensureId(item);
console.log(item); // 输出: { name: 'Apple', id: 'id_1' }  

let anotherItem = { name: 'Banana', id: 'existing_id' };
ensureId(anotherItem);
console.log(anotherItem); // 输出: { name: 'Banana', id: 'existing_id' }（因为已经有一个ID了）

const setLocalStorageItems = (prefix, sourceArr = []) => {
    // 先删除所有以指定前缀开头的项  
    removeLocalStorageItemsByPrefix(prefix);
    // 存储新的项  
    sourceArr.forEach(item => {
        const obj = ensureId(item);
        const key = prefix + obj.id;
        const value = JSON.stringify(obj);
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Error setting item with key ${key}`, error);
        }
    });
};

const getLocalStorageItemsByPrefix = (prefix, resultArray = []) => {
    // 初始化resultArray作为参数，避免外部arr的副作用  
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
            const id = key.substring(prefix.length);
            try {
                const obj = JSON.parse(localStorage.getItem(key));
                // 修正arr.some中的条件，使用===进行比较  
                if (!resultArray.some(item => item.id === id)) {
                    resultArray.push(obj);
                }
            } catch (error) {
                console.error(`Error parsing item with key ${key}`, error);
            }
        }
    }
    return resultArray; // 返回结果数组  
};

export { setLocalStorageItems, getLocalStorageItemsByPrefix }

// 老版：
// const deleteLocalStorageItemsByPrefix = (predix) => {
//     for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i);
//         if (key.includes(predix)) {
//             localStorage.removeItem(key);
//             i--;💥
//         }
//     }
// }

// const setlocalStorageItem = (predix, arr) => {
//     deleteLocalStorageItemsContaining(predix)
//     arr.forEach(item => {
//         let key = predix + item.id
//         let value = JSON.stringify({ item })
//         localStorage.setItem(key, value)
//     })
// }

// const getlocalStorageItem = (predix, arr) => {
//     for (let i = 0; i < localStorage.length; i++) {
//         if (localStorage.key(i).includes(predix)) {
//             let Index = localStorage.key(i)
//             let id = Index.replace(predix, '')
//             let obj = JSON.parse(localStorage.getItem(Index))
//             if (arr.some(item => (item.id = id))) return
//             else arr.push(obj)
//         }
//     }
// }