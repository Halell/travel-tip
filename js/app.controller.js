import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos

function onInit() {
    mapService.initMap()
        .then((map) => {
            console.log(map)
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

//-----------------render ---------------------//

function renderPlace(places) {
    var htmlStr = ''
    places.map((place, idx) => {
        htmlStr += `<li class="location" data-loc-num="1">
        Home
        <img src="" class="delete-loc-btn">
        <img src="" class="go-to-loc-btn">
    </li>`

        // `<div>
        // <div >${place.placeName}</div>
        // <img class="go-to" onclick="goToSavedPlace(${idx})" src="css/img/my-locations-icon.png">
        // <img class="delete-place"onclick="deletePlace(${idx})" src="css/img/delete.png">
        // </div>`
    })
    var elPlaces = document.querySelector('.map-saved-places-container')
    elPlaces.innerHTML = htmlStr
}

// --------------- on events-------------------//

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
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