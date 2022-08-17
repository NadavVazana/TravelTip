import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGetLatlngByAddress = onGetLatlngByAddress



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

function onGetLatlngByAddress(address){
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
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function renderLocations(locs) {
    let strHTMLs = locs.map(loc => {
        return `<div class="loc">
        <img src="img/marker.png" alt="marker">
        <div class="loc-info">
            <div class="loc-address">${loc.name}</div>
            <div class="loc-latlng">${loc.lng.toFixed(5)}, ${loc.lat.toFixed(5)}</div>
        </div>
        </div>`
    })
    document.querySelector('.locs').innerHTML = strHTMLs.join('')
}