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
