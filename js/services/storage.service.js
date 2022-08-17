export const storageService = {
    save: saveToStorage,
    load: loadFromStorage
}

function saveToStorage(key,value){
    var str = JSON.stringify(value)
    localStorage.setItem(key,str)
}

function loadFromStorage(key){
    var str= localStorage.getItem(key)
    return JSON.parse(str)
}