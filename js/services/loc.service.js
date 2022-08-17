import { storageService } from '../services/storage.service.js'
export const locService = {
    getLocs ,
    removeLocation 
}




function getLocs() {
    let locs = storageService.load('locsDB')
    return Promise.resolve(locs) 

    }


function removeLocation(lat,lng){
    let locs = storageService.load('locsDB')
    const location = locs.findIndex(loc => loc.lng === lng && loc.lat === lat)
    locs.splice(location,1)
    storageService.save('locsDB',locs)

    let markers = storageService.load('markersDB')
    const marker = markers.findIndex(marker => marker.lat === lat && marker.lng === lng)
    markers.splice(marker,1)
    storageService.save('markersDB',markers)
}    



