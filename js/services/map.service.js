// import { axios } from "../lib/axios"
// import { locService } from './services/loc.service.js'
import { storageService } from '../services/storage.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo
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
        })
}

function addMarker(loc) {

    var marker = new google.maps.Marker({
        position: { lat: loc.latLng.lat(), lng: loc.latLng.lng() },
        map: gMap,
        title: 'Hello World!'
    })
    getAddressByLatlng(marker.position)
    return marker
}

function getAddressByLatlng(loc) {
    const lat = loc.lat()
    const lng = loc.lng()
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GEO_KEY}`)
        .then(res => res.data)
        .then(loc =>{ 
            gLocations.push({ name: loc.results[0].formatted_address, lat, lng })
            storageService.save('locsDB', gLocations )})
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