const express = require('express')
const router = express.Router()

var NotifyClient = require('notifications-node-client').NotifyClient,
notify = new NotifyClient(process.env.NOTIFYAPIKEY);

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

// The URL here needs to match the URL of the page that the user is on
// when they type in their email address
router.post('/vandalism/send-confirmation-email', function (req, res) {
  console.log(req)
  console.log(req.query)
  console.log(req.query.lat)
  console.log(req.query.lon)
  lat = req.query.lat
  long = req.query.lon
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://api.postcodes.io/postcodes?lon=" + long + "&lat=" + lat, false);
  xmlHttp.send(null)
  console.info(xmlHttp.responseText)
  response = JSON.parse(xmlHttp.responseText)["result"]
  postcode = response[0]["postcode"]
  council = response[0]["admin_district"]

  notify.sendEmail(
    // this long string is the template ID, copy it from the template
    // page in GOV.UK Notify. It’s not a secret so it’s fine to put it
    // in your code.
    '80518213-9ab1-43b2-9368-027c8cd40292',
    // `emailAddress` here needs to match the name of the form field in
    // your HTML page
    process.env.email,
    {
      personalisation: {
        incident: "graffiti",
        street_name: postcode,
        name: "Thomas Yems",
        date: "19/02/2020",
        council: council + " Council",
        reference: "HDJ2123F"
      },
      reference: "HDJ2123F"
    }
  );

  // This is the URL the users will be redirected to once the email
  // has been sent
  res.redirect('/vandalism/confirmation');

});

notify2 = new NotifyClient(process.env.NOTIFYAPIKEY);

router.post('/vandalism/send-progress-email', function (req, res) {

  lat = req.query.lat
  long = req.query.lon
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://api.postcodes.io/postcodes?lon=" + long + "&lat=" + lat, false);
  xmlHttp.send(null)
  console.info(xmlHttp.responseText)
  response = JSON.parse(xmlHttp.responseText)["result"]
  postcode = response[0]["postcode"]
  council = response[0]["admin_district"]

  notify2.sendEmail(
    // this long string is the template ID, copy it from the template
    // page in GOV.UK Notify. It’s not a secret so it’s fine to put it
    // in your code.
    'e2f0b136-0ada-44fd-9d8d-a1db6c40fcc5',
    // `emailAddress` here needs to match the name of the form field in
    // your HTML page
    process.env.email,
    {
      personalisation: {
        incident: "graffiti",
        street_name: postcode,
        name: "Thomas Yems",
        date: "19/02/2020",
        council: council + " Council",
        reference: "HDJ2123F"
      },
      reference: "HDJ2123F"
    }
  );

  // This is the URL the users will be redirected to once the email
  // has been sent
  res.redirect('/vandalism/progress');

});

// Add your routes here - above the module.exports line

module.exports = router
