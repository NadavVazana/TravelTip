
// import { axios } from '../lib/axios.js'
import { storageService } from '../services/storage.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getAddressByLatlng,
    renderMarkers,
    getLatlngByAddress
}


// Var that is used throughout this Module (not global)
var gMap
var gLocations = storageService.load('locsDB') || []
const GEO_KEY = 'AIzaSyDyABlnJUJyx4m17RrerAlGHkq1LzMzW0w'
const API_KEY = 'AIzaSyDR9KBDAOGj8BPtLjEXjgRXspcgzeqEKwo'

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15

            })
            gMap.addListener('click', addMarker)
            renderMarkers()
        })
}

function renderMarkers(){
    const locs = storageService.load('locsDB')
    if(!locs || !locs.length) return
    locs.forEach(loc =>{
        new google.maps.Marker({
            position: { lat: loc.lat,lng:loc.lng },
            map: gMap,
            icon:'icon.png',
            title: 'Hello World!'
        })
    })

}
function addMarker(loc) {
    const lat =  loc.latLng.lat()
    const lng = loc.latLng.lng()
    var marker = new google.maps.Marker({
        position: { lat, lng },
        map: gMap,
        icon: 'icon.png',
        title: 'Hello World!'
    })
    getAddressByLatlng({lat,lng})
return marker}

function getLatlngByAddress(address){
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GEO_KEY}`)
    .then(loc => {
        console.log(loc);
        gLocations.push( {name:loc.data.results[0].formatted_address,lat:loc.data.results[0].geometry.location.lat,lng:loc.data.results[0].geometry.location.lng,id:makeId(),createdAt:Date.now()})
        
        storageService.save('locsDB', gLocations)
        renderMarkers()
        })
        
}
function getAddressByLatlng(loc) {


    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${GEO_KEY}`)
        .then(res => res.data)
        .then(location =>{ 
            console.log(location);
            gLocations.push({ name: location.results[0].formatted_address, lat:location.results[0].geometry.location.lat, lng:location.results[0].geometry.location.lng,id: makeId() ,createdAt:Date.now()})
            storageService.save('locsDB', gLocations )
        return location})
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

