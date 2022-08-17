export const locService = {
    getLocs
}


const locs = [
    
]
function setLoc(loc){
    locs.push(loc)
}
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


