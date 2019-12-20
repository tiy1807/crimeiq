/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

var mymap = window.L.map('mapid').setView([51.505, -0.09], 13);

window.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoidHllbXMiLCJhIjoiY2szeTZueHR6MGl1aDNscWNzOHMxaTBjOSJ9.NDdp3cYXLIxzlGuO7ejyGw'
}).addTo(mymap);

var marker = {}

function onMapClick(e) {
    if (marker != undefined) {
        mymap.removeLayer(marker)
    };
    marker = window.L.marker(e.latlng).addTo(mymap);
}

mymap.on('click', onMapClick);
