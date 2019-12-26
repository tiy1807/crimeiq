/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

var x = document.getElementById('mapid')
if (document.getElementById('mapid')) {
    var mymap = window.L.map('mapid').setView([53.96, -1.0873], 13);

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
        localStorage.setItem("myGPSlat",e.latlng.lat.toFixed(6))
        localStorage.setItem("myGPSlong",e.latlng.lng.toFixed(6))
    }

    mymap.on('click', onMapClick);
}

if (document.getElementById('incidents')) {
    var xmlHttp = new XMLHttpRequest();
    lat = localStorage.getItem("myGPSlat")
    long = localStorage.getItem("myGPSlong")
    if (lat == null){
      lat = "52.629729"
    }
    if (long == null) {
      long = "-1.131592"
    }
    window.console.info(lat)
    window.console.info(long)

    xmlHttp.open("GET", "https://data.police.uk/api/crime-last-updated", false);
    xmlHttp.send(null)
    date = JSON.parse(xmlHttp.responseText)["date"].substring(0,7)
    window.console.info(date)

    url = "https://data.police.uk/api/crimes-at-location?date=" + date + "&lat=" + lat + "&lng=" + long
    //url = "https://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + long + "&date=" + date
    xmlHttp.open("GET", url , false ); // false for synchronous request
    xmlHttp.send( null );
    window.console.info(xmlHttp.responseText)
    response = JSON.parse(xmlHttp.responseText)
    display_text = ""
    if (response.length == 0) {
      display_text = "No nearby incidents"
    } else {
      for (var i = 0; i < response.length; i++) {
        window.console.info(response[i])
        window.console.info(response.length)
        display_text += response[i]["month"] + " - " + response[i]["category"] + " - " + response[i]["location"]["street"]["name"]
        if (response[i]["outcome_status"] != null) {
          display_text += " - " + response[i]["outcome_status"]["category"] + "<br>"
        } else {
          display_text += "<br>"
        }
      }
    }
    document.getElementById("incidents").innerHTML = display_text
}
