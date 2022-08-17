import { storageService } from '../services/storage.service.js'
export const locService = {
    getLocs  
}




function getLocs() {
    let locs = storageService.load('locsDB')
    return Promise.resolve(locs) 

    }



