import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos

function onInit() {
    mapService.initMap()
        .then(() => {
            mapService.getMap()
                .addListener("dblclick", (ev) => {
                    let places = mapService.addNewPlace(ev)
                    renderPlace(places)
                })
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
    console.log(places)
    var htmlStr = places.map((place) => {
        return `<li class="location" data-loc="${place.placeName}"onclick="">
                     Home
                     <div class="delete-container">
                        <img src="" class="loc-btn delete-loc-btn" data-loc="${place.lat, place.lng}"onclick="onDeletePlace(this.dataset.loc)">
                    </div>
                    <div class="delete-container">
                        <img src="" class="loc-btn go-to-loc-btn" data-loc="${place.lat, place.lng}"onclick="onClickPanTo(this.dataset.loc)">
                    </div>
                     </li>`
    }).join()
    var elPlaces = document.querySelector('.locs')
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

function onClickPanTo(pos) {
    let posObj = {
        lat: pos.split(',')[0],
        lng: pos.split(',')[1]
    }
    mapService.panTo(posObj)
}

function onPanTo(pos) {
    console.log('Panning the Map')
    mapService.panTo(pos)
}