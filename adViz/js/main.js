const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const header = document.getElementById("header-bar");
const headerInfo = document.getElementById("header-info");
const mainScreen = document.getElementById("main-screen");
const addressList = document.getElementById('address-list');
const addScreen = document.getElementById("add-screen");
const updateScreen = document.getElementById("update-screen");
var map;
var mitte;

var isLoggedIn = false;
var isAdmina = false;

function Contact(firstname, lastname, street,
                  streetnr, zip, city, state,
                  country, isPrivate) {
  this.firstname = firstname;
  this.lastname = lastname;
  this.street = street;
  this.streetnr = streetnr;
  this.zip = zip;
  this.city = city;
  this.state = state;
  this.country = country;
  this.isPrivate = isPrivate;
  this.fullname = firstname + " " + lastname;
  this.address = street + " " + streetnr + " " + zip + " " + city;
}

var contact1 = new Contact("A1", "B1", "Treskowallee", "8", "10318",
                          "Berlin", "Berlin", "Germany", true);
var contact2 = new Contact("A2", "B2", "Wilhelminenhofstraße", "75A", "12459",
                            "Berlin", "Berlin", "Germany", false);
var contact3 = new Contact("A3", "B3", "Straße des 17. Juni", "135", "10623",
                          "Berlin", "Berlin", "Germany", true);
var contact4 = new Contact("A4", "B4", "Kaiserswerther Str.", "16", "14195",
                            "Berlin", "Berlin", "Germany", false);

var admina = {username: "admina",
              password: "admina",
              contacts: [contact1, contact2]};
var normalo = {username: "normalo",
                password: "normalo",
                contacts: [contact3, contact4]};

var currUser;

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;
  if (username === admina.username &&
      password === admina.password &&
        !isLoggedIn) {
    isLoggedIn = true;
    loginScreen.style.display = "none";
    mainScreen.style.display = "block";
    header.style.display = "block";
    headerInfo.innerHTML = "Hallo admina!";
    alert("You have successfully logged in.");
    isAdmina = true;
    currUser = admina;
    updateAddressList();
    updateMap();
  } else if (username === normalo.username &&
              password === normalo.password &&
              !isLoggedIn) {
    isLoggedIn = true;
    loginScreen.style.display = "none";
    mainScreen.style.display = "block";
    header.style.display = "block";
    headerInfo.innerHTML = "Hallo normalo!";
    currUser = normalo;
    updateAddressList();
    alert("You have successfully logged in.");
  } else {
    alert("Wrong username or password!");
  }
});

logoutButton.addEventListener("click", (e) => {
  isLoggedIn = false;
  isAdmina = false;
  mainScreen.style.display = "none";
  header.style.display = "none";
  loginScreen.style.display = "block";
});

function updateAddressList() {
 for (let contact of currUser.contacts) {
   addressList.innerHTML += '<li class="address">' +
                            contact.fullname  + '</li>';
 }
}

function initMap() {
  // The location of Berlin Mitte
  mitte = {lat:	52.531677, lng:	13.381777};
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: mitte,
  });
  // The marker, positioned at Berlin Mitte
  const marker = new google.maps.Marker({
    position: mitte,
    map: map,
  });
}

function updateMap() {
  for (let contact of currUser.contacts) {
    var xhr = new XMLHttpRequest();
    var url = "https://maps.googleapis.com/maps/api/geocode/json?"
    url = url + "address=" + contact.address;
    url = url +"&key=AIzaSyCiWbb2a4ZQMkVw1xJ5U2WMPvomDWeCZHY";
    xhr.open("GET", url, true);
    xhr.onerror = function() {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
      alert("Connecting to server with " + url + " failed!\n");
    };
    xhr.onload = function(e) {// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
      var data = this.response;
      var obj = JSON.parse(data);
      console.log(obj);
      if (this.status == 200) {
        if (obj.status != "ZERO_RESULTS") {
          const lat = obj.results[0].geometry.location.lat;
          const lng = obj.results[0].geometry.location.lng;
          const mkr = new google.maps.Marker({
            position: {lat: lat, lng:	lng},
            map: map,
          });
          console.log (lat +", " + lng);
        } else { alert ("Die Adresse konnte nicht aufgelöst werden!");}
      } else { //Handhabung von nicht-200er
        alert ("HTTP-status code was: " + obj.status);
      }
    };
    xhr.send();
  }
}
