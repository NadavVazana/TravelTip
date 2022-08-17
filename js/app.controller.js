import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import {weatherService} from './services/weather.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGetLatlngByAddress = onGetLatlngByAddress
window.onGetWeather = onGetWeather



function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))

}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)

    })
}

function onGetLatlngByAddress(ev){
    ev.preventDefault()
    const address = document.querySelector('.address-input').value
    mapService.getLatlngByAddress(address)
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            renderLocations(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {

             mapService.getAddressByLatlng({lat:pos.coords.latitude,lng:pos.coords.longitude})
            .then(res => {
                document.querySelector('.user-pos').innerText =
                `${res.results[0].formatted_address}`
                })


        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo() {
    getPosition().then(pos =>  mapService.panTo(pos.coords.latitude,pos.coords.longitude) )
}
function onGetWeather(lat,lng){
     weatherService.getWeather(lat,lng)
    .then(renderWeather)


}
function renderWeather(){

    
}
function renderLocations(locs) {
    let strHTMLs = locs.map(loc => {
        return `<div onclick="onGetWeather(${loc.lat},${loc.lng})" class="loc">
        <img src="img/marker.png" alt="marker">
        <div class="loc-info">
            <div class="loc-address">${loc.name}</div>
            <div class="loc-latlng">${loc.lng}, ${loc.lat}</div>
        </div>
        </div>`
    })
    document.querySelector('.locs').innerHTML = strHTMLs.join('')
}