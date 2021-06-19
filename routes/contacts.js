var express = require('express');
var router = express.Router();

function Contact(id, firstname, lastname, street, streetnr, zip, city, state, country, isPrivate, owner, lat, lng) {
  this.id = id;
  this.firstname = firstname;
  this.lastname = lastname;
  this.street = street;
  this.streetnr = streetnr;
  this.zip = zip;
  this.city = city;
  this.state = state;
  this.country = country;
  this.isPrivate = isPrivate;
  this.owner = owner;
  this.lat = lat;
  this.lng = lng;
}
function fullname(contact){
	return contact.firstname + " " + contact.lastname;
}
function address(contact){
	return contact.street + " " + contact.streetnr + " " + contact.zip +" " + contact.city;
}

var contact1 = new Contact(1, "Peter", "Peterson", "Treskowallee", "8", "10318",
                          "Berlin", "Berlin", "Germany", true, "admina",
                          52.49222, 13.5264999);
var contact2 = new Contact(2, "A2", "B2", "Wilhelminenhofstraße", "75", "12459",
                            "Berlin", "Berlin", "Germany", false, "admina",
                          52.4570506, 13.5275799);
var contact3 = new Contact(3, "A3", "B3", "Straße des 17. Juni", "135", "10623",
                          "Berlin", "Berlin", "Germany", true, "normalo",
                        52.5122205, 13.3270894);
var contact4 = new Contact(4, "A4", "B4", "Kaiserswerther Str.", "16", "14195",
                            "Berlin", "Berlin", "Germany", false, "normalo",
                          52.4479602, 13.2856298);

//Alle Kontakte
var contacts = [contact1, contact2, contact3, contact4];

router.post('/', function(req, res, next) {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let street = req.body.street;
  let streetnr = req.body.streetnr;
  let zip = req.body.zip;
  let city = req.body.city;
  let state = req.body.state;
  let country = req.body.country;
  let isPrivate = req.body.isPrivate;
  let owner = req.body.owner;
  let lat = req.body.lat;
  let lng = req.body.lng;
  console.log("[ROUTER contacts.js] post");
  console.log(req.body);
  contacts.push(new Contact(contacts.length, firstname, lastname, street, streetnr, zip,
    city, state, country, isPrivate, owner, lat, lng));
  res.status(201).json({"id" : contacts.length-1});
  res.end();
});

router.get('/', function(req, res, next) {
  res.status(200).send(contacts);
  res.end();
});

router.get('/:id', function(req, res, next) {
  let id = Number(req.params.id);
  console.log(id);
  if (id <= contacts.length && id > 0) {
    res.set('application/json');
    res.status(200).send(JSON.stringify(contacts[id-1]));
  } else
    res.status(401);
  res.end();
});

module.exports = router;
