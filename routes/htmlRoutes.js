const path = require("path");
const testData = require("../public/js/testdata.js");
const searchProducts = require("../public/js/productGetter.js");
const db = require("../models");
const moment = require("moment");

//console.log("user directed to /index - email: ", req.user.email);
// can autopopulate from google if we want
// username:	req.user.email
// firstname:  req.user.name.givenName
// lastname:	req.user.name.familyName
// email:		req.user.email;
// googleId: 	req.user.id;

module.exports = function(app) {
  // Load index page

  app.get("/", (req, res) => {
    res.render("logon");
    //res.sendFile(path.join(__dirname + "/../public/html/logon.html"));
  });

  app.get("/logon", (req, res) => {
    res.render("logon");
    //res.sendFile(path.join(__dirname + "/../public/html/logon.html"));
  });

  app.get("/index", (req, res) => {
    function renderPage(hbsObjects) {
      res.render("index", hbsObjects);
    }

    function loadDataToIndex() {
      let contacts = "";
      let events = "";
      db.Contact.findAll({
        //where: { personId: req.params.personId },
        where: { personId: 1 },
        include: [
          {
            model: db.Person,
            as: "fk_linkedPersonId"
          }
        ],
        raw: true
      }).then(function(dbData) {
        contacts = dbData;
        console.log(contacts);
        console.log(contacts[0]['fk_linkedPersonId.id'])
        db.Event.findAll({
          where: {
            //createdBy: req.params.createdBy,
            createdBy: 1,
            eventDate: {
              $between: [
                moment().toISOString(),
                moment()
                  .add("days", 14)
                  .toISOString()
              ]
            }
          },
          include: [
            {
              model: db.Person
            }
          ],
          raw: true
        }).then(function (eventData) {
          events = eventData;
          //console.log(events);

          let hbsObjects = {
            events: events,
            contacts: contacts
            // TODO: need help loading products from productGetter.js need async function
            //products: searchProducts("cat toys")
          };
          renderPage(hbsObjects);
        });
      });

      /* db.Person.findOne({
        //where: { id: req.params.createdBy }
        where: { id: 1 }
      }).then(function() { */
      //});

      //const contacts = testData.testContacts.sort(dynamicSort("lastName"));
      //const events = testData.testEvents.sort(dynamicSort("eventDate"));
      //console.log(testData.testContacts);
      //console.log(testData.testEvents);
    }
    loadDataToIndex();
  });

  app.get("/profile", (req, res) => {
    //console.log("user directed to /profile - email: ", req.user.email);
    //res.sendFile(path.join(__dirname + "/../public/html/profile.html"));
    function renderPage(hbsObjects) {
      res.render("index", hbsObjects);
    }

    function loadDataToProfile() {
      let contacts = "";
      let events = "";
      db.Contact.findAll({
        //where: { personId: req.params.personId },
        where: { personId: 1 },
        include: [
          {
            model: db.Person,
            as: "fk_linkedPersonId"
          }
        ],
        raw: true
      }).then(function(dbData) {
        contacts = dbData;
        console.log(contacts);
        console.log(contacts[0]['fk_linkedPersonId.id'])
        db.Event.findAll({
          where: {
            //createdBy: req.params.createdBy,
            createdBy: 1,
            eventDate: {
              $between: [
                moment().toISOString(),
                moment()
                  .add("days", 14)
                  .toISOString()
              ]
            }
          },
          include: [
            {
              model: db.Person
            }
          ],
          raw: true
        }).then(function (eventData) {
          events = eventData;
          console.log(events);

          let hbsObjects = {
            events: events,
            contacts: contacts
            // TODO: need help loading products from productGetter.js need async function
            //products: searchProducts("cat toys")
          };
          renderPage(hbsObjects);
        });
      });
    }
    loadDataToProfile();
  });

  app.get("/contacts", (req, res) => {
    function renderPage(hbsObjects) {
      res.render("contacts", hbsObjects);
    }

    function loadDataToContact() {
      const contacts = testData.testContacts.sort(dynamicSort("lastName"));
      const eventsByContact = "";
      const preferencesByContact = testData.testPreferences.sort(dynamicSort("preference"));
      const savedGiftsByContact = "";
      const purchasesByContact = "";
      console.log(contacts);
      console.log(eventsByContact);
      console.log(preferencesByContact);
      console.log(savedGiftsByContact);
      console.log(purchasesByContact);

      let hbsObjects = {
        events: eventsByContact,
        contacts: contacts,
        preferences: preferencesByContact,
        //products: searchProducts("cat toys"),
        savedGifts: savedGiftsByContact,
        purchases: purchasesByContact
      };

      renderPage(hbsObjects);
    }
    loadDataToContact();
  });

  app.get("/new-user", (req, res) => {
    function renderPage(hbsObjects) {
      res.render("new-user", hbsObjects);
    }

    function loadDataToSignIn() {
      const users = testData.testPerson.sort(dynamicSort("lastName"));
      const savedDates = testData.testSavedDates.sort(dynamicSort("description"));
      console.log(users);
      console.log(savedDates);

      let hbsObjects = {
        users: users,
        products: searchProducts("cat toys")
      };

      renderPage(hbsObjects);
    }
    loadDataToSignIn();
  });

  app.get("/calendartest", (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/html/mike-calendar.html"));
  });

  // Render 404 page for any unmatched routes
  app.get("*", (req, res) => {
    res.render("404");
  });
};

// function to sort object by property
const dynamicSort = property => {
  let sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return (a, b) => {
    if (sortOrder === -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};
