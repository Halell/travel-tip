import { API_KEY } from '../apikeys.js'
import { storageService } from '../services/storage.service.js'


export const mapService = {
    initMap,
    addMarker,
    panTo
}

const STORAGE_KEY = 'PLACES'
var gPlaces = loadPlaces()
var gMap

function loadPlaces() {
    var places = storageService.load(STORAGE_KEY)
    if (!places || !places.length) {
        places = []
    }
    return places
}


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
            gMap.addListener("dblclick", (ev) => {
                let newPos = addNewPlace(ev)
                if (!newPos.placeName) return
                addMarker({ lat: ev.latLng.lat(), lng: ev.latLng.lng() }, newPos)

            })
        })
}

function addMarker(newPos) {
    var marker = new google.maps.Marker({
        position: { lat: newPos.lat, lng: newPos.lng },
        map: gMap,
        title: newPos.placeName
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    console.log('ingoogle :')

    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


// function getPlaces() {
//     return gPlaces
// }

function addNewPlace(ev) {
    var newPos = {
        id: 0,// add incrementor
        lat: ev.latLng.lat(),
        lng: ev.latLng.lng(),
        placeName: prompt('name'),
    }

    if (!newPos.placeName) return newPos

    gPlaces.push(newPos)
    _savePlacesToStorage()
    return newPos
}
// function deletePlaceIdx(idx) {
//     gPlaces.splice(idx, 1)
//     _savePlacesToStorage
// }


function _savePlacesToStorage() {
    storageService.save(STORAGE_KEY, gPlaces)
}