import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'
import { weatherService } from './services/weather.service.js'
window.currLoc = {}
window.onload = onInit
// window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGetLatlngByAddress = onGetLatlngByAddress
window.onGetWeather = onGetWeather
window.onRemoveLocation = onRemoveLocation
window.saveCurrPos = saveCurrPos
window.setQueryStringParams = setQueryStringParams
window.renderQueryParams = renderQueryParams
window.onCopyLocation = onCopyLocation


function onInit() {

    mapService.initMap()
        .then(() => {
            onGetLocs()
            renderQueryParams()
        })
        .catch(() => console.log('Error: cannot init map'))

}

function renderQueryParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const lat = queryStringParams.get('lat')
    const lng = queryStringParams.get('lng')
    if (!lat && !lng) {
        getPosition()
            .then(res => { return { lat: res.coords.latitude, lng: res.coords.longitude } })
            .then(mapService.panTo)
    }
    mapService.panTo(lat, lng)
}

function setQueryStringParams() {
    console.log(currLoc);
    const queryStringParams = `?lat=${currLoc.lat}&lng=${currLoc.lng}`
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}




// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}
function saveCurrPos(pos) {
    currLoc = { lat: pos.lat, lng: pos.lng }
    storageService.save('currLoc', currLoc)
}
function onGetLatlngByAddress(ev) {
    ev.preventDefault()
    const address = document.querySelector('.address-input').value
    mapService.getLatlngByAddress(address)
        .then(pos => {
            renderCurrentLocation(pos.data.results[0].formatted_address)
            saveCurrPos({ lat: pos.data.results[0].geometry.location.lat, lng: pos.data.results[0].geometry.location.lng })
            setQueryStringParams()
            return pos.data.results[0].geometry.location
        })
        .then(pos => {
            onGetLocs()
            mapService.panTo(pos)
        })





}



function renderCurrentLocation(address) {
    document.querySelector('.user-pos').innerText =
        `${address}`
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
    saveCurrPos({ lat, lng })
    setQueryStringParams()
    renderCurrentLocation(name)
    weatherService.getWeather(lat, lng)
        .then(renderWeather)
    mapService.panTo(lat, lng)

}

function onCopyLocation() {
    const text = window.location.href
    navigator.clipboard.writeText(text)
    document.querySelector('.copy-modal').classList.add('modal-open')
    setTimeout(() => {
        document.querySelector('.copy-modal').classList.remove('modal-open')
    }, 2500);
}

function renderWeather(weather) {
    console.log('weather:', weather)
    const elWeatherDiv = document.querySelector('.weather-info')
    let strHTML = `
    
    <div class="weather-left">
        <p>${weather.city}, ${weather.country} <img class="flag" src="https://countryflagsapi.com/png/${weather.country}" alt=""></p>
        <p>${capitalize(weather.desc)} <img src="http://openweathermap.org/img/w/${weather.icon}.png" alt=""></p>
    </div>
    <div class="weather-right">
        <p>Temp: <span class="temp">${k2c(weather.temp).toFixed(2)}??C</span></p>
        <p>Feels Like: <span class="temp">${k2c(weather.feels).toFixed(2)}??C</span></p>
        <p>Humidity: ${weather.humid}%</p>
    </div>
        
    `
    elWeatherDiv.innerHTML = strHTML
}

function renderLocations(locs) {
    let strHTMLs = locs.map(loc => {
        return `<div class="loc">
        <div class="loc-btn">
            <img  onclick="onGetWeather(${loc.lat},${loc.lng},'${loc.name}')" src="img/marker.png" alt="marker">
        </div>
        
        <div class="loc-info">
            <div class="loc-address">${loc.name}</div>
            <div class="loc-latlng">${loc.lng}, ${loc.lat}</div>
            </div>
            <button onclick="onRemoveLocation(${loc.lat},${loc.lng})" class="btn delete-button">X</button>
        </div>`
    })
    document.querySelector('.locs').innerHTML = strHTMLs.join('')
}

function k2c(kelvin) {
    return kelvin - 273.15
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function onRemoveLocation(lat, lng) {
    locService.removeLocation(lat, lng)
    mapService.initMap()
    locService.getLocs().then(renderLocations)
}