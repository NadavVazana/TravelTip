
// import { axios } from '../lib/axios.js'
import { storageService } from '../services/storage.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getAddressByLatlng,
    renderMarkers,
    getLatlngByAddress,
    // removeMarker
}


// Var that is used throughout this Module (not global)
var gMap
var gMarkers = storageService.load('markersDB') || []
var gLocations = storageService.load('locsDB') || []
const GEO_KEY = 'AIzaSyDyABlnJUJyx4m17RrerAlGHkq1LzMzW0w'
const API_KEY = 'AIzaSyDR9KBDAOGj8BPtLjEXjgRXspcgzeqEKwo'

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15

            })
            gMap.addListener('click', addMarker)
            renderMarkers()
        })
}

function renderMarkers() {

    const markers = storageService.load('markersDB')
    if (!markers || !markers.length) return
    markers.forEach(marker => {
        new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: gMap,
            icon: 'icon.png',
            title: 'Hello World!'
        })
    })

}

function addMarker(loc) {
    const lat = loc.latLng.lat()
    const lng = loc.latLng.lng()
    var marker = new google.maps.Marker({
        position: { lat, lng },
        map: gMap,
        icon: 'icon.png',
        title: 'Hello World!'
    })
    gMarkers.push({ lat, lng })
    storageService.save('markersDB', gMarkers)
    getAddressByLatlng({ lat, lng })
}

function getLatlngByAddress(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GEO_KEY}`)
        .then(loc => {
            gLocations.push({ name: loc.data.results[0].formatted_address, lat: loc.data.results[0].geometry.location.lat, lng: loc.data.results[0].geometry.location.lng, id: makeId(), createdAt: Date.now() })
            gMarkers.push({ lat: loc.data.results[0].geometry.location.lat, lng: loc.data.results[0].geometry.location.lng })
            storageService.save('markersDB', gMarkers)
            storageService.save('locsDB', gLocations)
            renderMarkers()
            return loc
        })
}

function getAddressByLatlng(loc) {


    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${GEO_KEY}`)
        .then(res => res.data)
        .then(location =>{ 
            gLocations.push({ name: location.results[0].formatted_address, lat:location.results[0].geometry.location.lat, lng:location.results[0].geometry.location.lng,id: makeId() ,createdAt:Date.now()})
            storageService.save('locsDB', gLocations )
            onGetLocs()
            saveCurrPos({lat:location.results[0].geometry.location.lat, lng:location.results[0].geometry.location.lng})
            setQueryStringParams()
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

