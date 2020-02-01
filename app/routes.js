const express = require('express')
const router = express.Router()

var NotifyClient = require('notifications-node-client').NotifyClient,
notify = new NotifyClient(process.env.NOTIFYAPIKEY);

// The URL here needs to match the URL of the page that the user is on
// when they type in their email address
router.post('/vandalism/personal', function (req, res) {

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
        street_name: "Farringdon Street",
        name: "Thomas Yems",
        date: "19/02/2020",
        council: "City of London Council",
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

router.get('/vandalism/send-progress-email', function (req, res) {

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
        street_name: "Farringdon Street",
        name: "Thomas Yems",
        date: "19/02/2020",
        council: "City of London Council",
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
