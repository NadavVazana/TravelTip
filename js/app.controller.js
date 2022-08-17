import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGetLatlngByAddress = onGetLatlngByAddress
window.onGetWeather = onGetWeather
window.onRemoveLocation = onRemoveLocation



function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
    onGetLocs()
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)

    })
}

function onGetLatlngByAddress(ev) {
    ev.preventDefault()
    const address = document.querySelector('.address-input').value
    mapService.getLatlngByAddress(address)
        .then(pos => {
            renderCurrentLocation(pos.data.results[0].formatted_address)
            return pos.data.results[0].geometry.location
        })
        .then(pos => mapService.panTo(pos))






}

function renderCurrentLocation(address) {
    document.querySelector('.user-pos').innerText =
        `${address}`
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

            mapService.getAddressByLatlng({ lat: pos.coords.latitude, lng: pos.coords.longitude })
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
    getPosition().then(pos => mapService.panTo(pos.coords.latitude, pos.coords.longitude))
}
function onGetWeather(lat, lng, name) {
    renderCurrentLocation(name)
    weatherService.getWeather(lat, lng)
        .then(renderWeather)
    mapService.panTo(lat, lng)

}
function renderWeather(weather) {
    const elWeatherDiv = document.querySelector('.weather-info')
    let strHTML = `
        <p>${weather.desc}</p>
        <p>Temp: ${k2c(weather.temp).toFixed(2)}C</p>
        <p>Feels Like: ${k2c(weather.feels).toFixed(2)}</p>
    `
    elWeatherDiv.innerHTML = strHTML
}
function renderLocations(locs) {
    let strHTMLs = locs.map(loc => {
        return `<div class="loc">
        <img  onclick="onGetWeather(${loc.lat},${loc.lng},'${loc.name}')" src="img/marker.png" alt="marker">
        <div class="loc-info">
            <div class="loc-address">${loc.name}</div>
            <div class="loc-latlng">${loc.lng}, ${loc.lat}</div>
            <button onclick = "onRemoveLocation(${loc.lat},${loc.lng})" class="delete-button">X</button>
        </div>
        </div>`
    })
    document.querySelector('.locs').innerHTML = strHTMLs.join('')
}

function k2c(kelvin) {
    return kelvin - 273.15
}