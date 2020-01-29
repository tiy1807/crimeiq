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

    function showPosition(position) {

      var mymap = window.L.map('mapid').setView([position.coords.latitude, position.coords.longitude], 15);

      window.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          accessToken: 'pk.eyJ1IjoidHllbXMiLCJhIjoiY2szeTZueHR6MGl1aDNscWNzOHMxaTBjOSJ9.NDdp3cYXLIxzlGuO7ejyGw',
          tileSize: 512,
          zoomOffset: -1
      }).addTo(mymap);

      var marker = {}

      localStorage.setItem("myGPSlat",position.coords.latitude.toFixed(6))
      localStorage.setItem("myGPSlong",position.coords.longitude.toFixed(6))
      marker = window.L.marker(L.latLng(position.coords.latitude, position.coords.longitude)).addTo(mymap);

      function onMapClick(e) {
          if (marker != undefined) {
              mymap.removeLayer(marker)
          };
          marker = window.L.marker(e.latlng).addTo(mymap);
          localStorage.setItem("myGPSlat",e.latlng.lat.toFixed(6))
          localStorage.setItem("myGPSlong",e.latlng.lng.toFixed(6))

          var xmlHttp = new XMLHttpRequest();
          xmlHttp.open("GET", "https://api.postcodes.io/postcodes?lon=" + e.latlng.lng.toFixed(6) + "&lat=" + e.latlng.lat.toFixed(6), false);
          xmlHttp.send(null)
          window.console.info(xmlHttp.responseText)
          response = JSON.parse(xmlHttp.responseText)["result"]
          postcode = response[0]["postcode"]
          council = response[0]["admin_district"]
          display_text = "You have selected " + postcode + " in " + council + ".<br>If different please select the location of the vandalism on the map below:"
          document.getElementById("text-location").innerHTML = display_text
      }

      mymap.on('click', onMapClick);

    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
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
      display_text = "There have been no recent incidents nearby"
    } else {
      display_text = "The following have been reported recently. Click on an incident to add your infomation, or click my incident is new.<br>"
      for (var i = 0; i < response.length; i++) {
        window.console.info(response[i])
        window.console.info(response.length)
        display_text += response[i]["category"] + " - " + response[i]["location"]["street"]["name"]
        if (response[i]["outcome_status"] != null) {
          display_text += " - " + response[i]["outcome_status"]["category"] + "<br>"
        } else {
          display_text += "<br>"
        }
      }
    }
    document.getElementById("incidents").innerHTML = display_text
}

if (document.getElementById('responsible-la')) {
  var xmlHttp = new XMLHttpRequest();
  lat = localStorage.getItem("myGPSlat")
  long = localStorage.getItem("myGPSlong")
  xmlHttp.open("GET", "https://api.postcodes.io/postcodes?lon=" + long + "&lat=" + lat, false);
  xmlHttp.send(null)
  window.console.info(xmlHttp.responseText)
  response = JSON.parse(xmlHttp.responseText)["result"]
  postcode = response[0]["postcode"]
  council = response[0]["admin_district"]
  display_text = "This is being dealt with by " + council + " Council."
  document.getElementById("responsible-la").innerHTML = display_text
}

if (document.getElementById('responsible-police')) {
  var xmlHttp = new XMLHttpRequest();
  lat = localStorage.getItem("myGPSlat")
  long = localStorage.getItem("myGPSlong")
  xmlHttp.open("GET", "https://data.police.uk/api/locate-neighbourhood?q=" + lat + "," + long, false);
  xmlHttp.send(null)
  window.console.info(xmlHttp.responseText)
  response = JSON.parse(xmlHttp.responseText)
  force = response["force"]
  display_text = "This is being dealt with by the " + force + " Police Force."
  document.getElementById("responsible-police").innerHTML = display_text
}

if (document.getElementById('text-location')) {
  function displayPosition(position) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.postcodes.io/postcodes?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude, false);
    xmlHttp.send(null)
    window.console.info(xmlHttp.responseText)
    response = JSON.parse(xmlHttp.responseText)["result"]
    postcode = response[0]["postcode"]
    council = response[0]["admin_district"]
    display_text = "Your location has been detected at " + postcode + " in " + council + ".<br>If different please select the location of the vandalism on the map below:"
    document.getElementById("text-location").innerHTML = display_text
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayPosition);
  }
}
