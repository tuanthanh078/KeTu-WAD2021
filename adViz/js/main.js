const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const header = document.getElementById("header-bar");
const headerInfo = document.getElementById("header-info");
const mainScreen = document.getElementById("main-screen");
const addressList = document.getElementById('address-list');

const addScreen = document.getElementById("add-screen");
const addForm = document.getElementById("add-form");
const addNewButton = document.getElementById("add-new-button");
const addButtons = document.getElementById("add-buttons");
addButtons.remove();
const updateButtons = document.getElementById("update-buttons");
const updateButton = document.getElementById("apply-button");
const deleteButton = document.getElementById("delete-button");
updateButtons.remove();
const ownerSelect = document.getElementById("owner-select");

var map;
var mitte;

// var isLoggedIn = false;
// var isAdmina = false;

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
function fullname(contact){
	return contact.firstname + " " + contact.lastname;
}
function address(contact){
	return contact.street + " " + contact.streetnr + " " + zip +" " + city;
}

var contact1 = new Contact("Peter", "Peterson", "Treskowallee", "8", "10318",
                          "Berlin", "Berlin", "Germany", true);
var contact2 = new Contact("A2", "B2", "Wilhelminenhofstraße", "75A", "12459",
                            "Berlin", "Berlin", "Germany", false);
var contact3 = new Contact("A3", "B3", "Straße des 17. Juni", "135", "10623",
                          "Berlin", "Berlin", "Germany", true);
var contact4 = new Contact("A4", "B4", "Kaiserswerther Str.", "16", "14195",
                            "Berlin", "Berlin", "Germany", false);

function User(username, password, contacts, isAdmin){
	this.username = username;
	this.password = password;
	this.contacts = contacts;
	this.isAdmin = isAdmin;
	
	var option = document.createElement("option");
	option.appendChild(document.createTextNode(username));
	addForm.owner.appendChild(option);
}
	
var admina = new User("admina", "admina", [contact1, contact2], true);
var normalo = new User("normalo", "normalo", [contact3, contact4], false);

//Fasst die gegebenen Elemente zu einem Formular zusammen, in dem alle gegebenen
//Input Felder required sind, damit der submit button aktiviert ist
function createForm(requiredFields, submitButtons){
	for(let button of submitButtons){
		button.disabled = true;
	}
	
	for(let i = 0; i<requiredFields.length; i++){
		requiredFields[i].valid = false;
	}
	
	for(let i = 0; i<requiredFields.length; i++){
		requiredFields[i].addEventListener("keyup", (e) => {
			
			requiredFields[i].valid = requiredFields[i].checkValidity();
			
			for(let j = 0; j<requiredFields.length; j++){
				if(requiredFields[j].valid == false){
					for(let button of submitButtons){
						button.disabled = true;
					}
					break;
				}
				if(j == requiredFields.length-1){
					for(let button of submitButtons){
						button.disabled = false;
					}
				}
			}
		});
	}
}
function setValue(field, value){
	field.value = value;
	field.valid = field.checkValidity();
}


createForm([loginForm.username, loginForm.password],[loginButton]);
createForm([addForm.firstname, addForm.lastname, addForm.street, addForm.streetnr, addForm.zip, addForm.city],[addButtons,updateButton]);

var users = [admina, normalo];

var isUpdated = false;
var currUser;

loginButton.addEventListener("click", (e) => {
	e.preventDefault();
	const username = loginForm.username.value;
	const password = loginForm.password.value;
	
	let loginCorrect = false;
  
	for(let i = 0; i< users.length;i++){
		if(username === users[i].username &&
			password === users[i].password){
			
			//Setze Login war korrekt
			loginCorrect = true;
			
			//Setze aktuellen User
			currUser = users[i];	
			
			//Wechsel zu mainScreen
			loginScreen.style.display = "none";
			mainScreen.style.display = "block";		

			//Zeige Header mit Begruessung und Logout Button
			header.style.display = "block";
			headerInfo.innerHTML = "Hello "+currUser.username+"!";
			
			//Lade Karten Marker und Kontaktliste
			if(!isUpdated){
				reloadAddressListUser();
				updateMap();
				isUpdated = true;
			}
			
			//Entferne Admin Felder fuer Normalo
			if(!currUser.isAdmin){
				ownerSelect.remove();
			}
			
			break;
		}
	}
	
	if(loginCorrect){
		alert("You have successfully logged in");
	}else{
		alert("Wrong username or password!");
	}
});

logoutButton.addEventListener("click", (e) => {
  //isLoggedIn = false;
  //isAdmina = false;
  mainScreen.style.display = "none";
  header.style.display = "none";
  loginScreen.style.display = "block";

	if(!currUser.isAdmin){
		addForm.insertBefore(ownerSelect, document.getElementById("private-row"));
	}
	
	loginForm.password.value = "";
	loginButton.disabled = true;
});

//Verstecke alle Kontakte dessen besitzer nicht der aktuelle Nutzer ist,
//Wenn der Show my contacts Button gedrueckt wird
document.getElementById("show-my-button").addEventListener("click",(e) => {
	reloadAddressListUser();
});

//Verstecke 
document.getElementById("show-all-button").addEventListener("click", (e) => {
	reloadAddressListAll();
});

let userOnlyAddresses = true;

function reloadAddressListUser() {
	addressList.innerHTML = "";
	for (let contact of currUser.contacts) {
		addToAddressList(contact);
	}
	userOnlyAddresses = true;
}

function reloadAddressListAll(){
	reloadAddressListUser();
	for (let user of users){
		if(user !== currUser){
			for( let contact of user.contacts){
				if(contact.isPrivate == false){
					addToAddressList(contact);
				}	
			}
		}
	}
	userOnlyAddresses = false;
}

let selectedContact;

//Fuegt den spezifizierten Kontakt zur Addressliste des MainScreens hinzu
//Gegebebenen Falls wird der Bearbeiten Screen fuer den Kontakt freigeschaltet
function addToAddressList(contact){
	//addressList.innerHTML += '<li class="address">' + contact.fullname + '</li>';
	let addressLi = document.createElement("li");
	addressLi.innerHTML = fullname(contact);
	addressLi.className = "address";
	
	if(currUser.isAdmin == true || (getOwner(contact).username === currUser.username)){
	
		//alert("Add listener for contact: "+contact.fullname+ ".");
			
		addressLi.addEventListener("click", (e) => {
			
			selectedContact = contact;
			
			updateButton.disabled = false;
			addForm.appendChild(updateButtons);
			
			setValue(addForm.firstname, contact.firstname);
			setValue(addForm.lastname, contact.lastname);
			setValue(addForm.street, contact.street);
			setValue(addForm.streetnr, contact.streetnr);
			setValue(addForm.zip, contact.zip);
			setValue(addForm.city, contact.city);
			setValue(addForm.state, contact.state);
			setValue(addForm.country, contact.country);
			addForm.private.checked = contact.isPrivate;
		
			//Setzte den korrekten owner des ausgewaehlten Kontakts
			if(currUser.isAdmin){
				for(let i = 0; i<users.length; i++){
					for(let userContact of users[i].contacts){
						if(userContact === contact){
							addForm.owner.selectedIndex = i;
							break;
						}
					}
				}
			}
		
			mainScreen.style.display = "none";
			header.style.display = "none";
			addScreen.style.display = "block";
		});
	}
	addressList.appendChild(addressLi);
}

function getOwner(contact){
	for(let i = 0; i<users.length; i++){
		for(let userContact of users[i].contacts){
			if(userContact === contact){
				return users[i];
			}
		}
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

function setMarker(contact){
	var xhr = new XMLHttpRequest();
	var url = "https://maps.googleapis.com/maps/api/geocode/json?";
    url = url + "address=" + address(contact);
    url = url +"&key=AIzaSyCiWbb2a4ZQMkVw1xJ5U2WMPvomDWeCZHY";
	xhr.open("GET", url, true);
	// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
	xhr.onerror = function(){
		alert("Connecting to server with " + url + " failed!\n");
		return false;
	};
	// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
	xhr.onload = function(e){
		var data = this.response;
		var obj = JSON.parse(data);
		console.log(obj);
		if(this.status == 200){
			if(obj.status == "ZERO_RESULTS"){
				alert("The address could not be resolved");
				return false;
			}else{
				const lat = obj.results[0].geometry.location.lat;
				const lng = obj.results[0].geometry.location.lng;
				const mkr = new google.maps.Marker({
					position: {lat: lat, lng:	lng},
            		map: map,
				});
				console.log (lat +", " + lng);
			}
		}else{
			alert ("HTTP-status code was: " + obj.status);
			return false;
		}
	}
	xhr.send();
}

addNewButton.addEventListener("click", (e) => {

	setValue(addForm.firstname, "");
	setValue(addForm.lastname, "");
	setValue(addForm.street, "");
	setValue(addForm.streetnr, "");
	setValue(addForm.zip, "");
	setValue(addForm.city, "");
	setValue(addForm.state, "");
	setValue(addForm.country, "");
	addForm.private.checked = true;
	
	mainScreen.style.display = "none";
	header.style.display = "none";
	
	//Prepare and show addScreen
	addScreen.appendChild(addButtons);
	addButtons.form = "add-form";
	addScreen.style.display = "block";
	
});

addButtons.addEventListener("click", (e) => {
	
	let owner = currUser;
	if(currUser.isAdmin){
		let ownerInput = addForm.owner.value;
		for(let user of users){
			if(user.username = ownerInput){
				owner = user;
				break;
			}
		}
	}
	
	let contactInput = new Contact(
			addForm.firstname.value,
			addForm.lastname.value,
			addForm.street.value,
			addForm.streetnr.value,
			addForm.zip.value,
			addForm.city.value,
			addForm.state.value,
			addForm.country.value,
			addForm.private.value,	
		);
	
	owner.contacts.push(contactInput);
	
	addToAddressList(contactInput);
	updateMap();
	
	addButtons.remove();	
	
	addScreen.style.display = "none";
	mainScreen.style.display = "block";
	header.style.display = "block";
});

updateButton.addEventListener("click", (e) => {
	
	selectedContact.firstname = addForm.firstname.value;
	selectedContact.lastname = addForm.lastname.value;
	selectedContact.street = addForm.street.value;
	selectedContact.streetnr = addForm.streetnr.value;
	selectedContact.zip = addForm.zip.value;
	selectedContact.city = addForm.city.value;
	selectedContact.state = addForm.state.value;
	selectedContact.country = addForm.country.value;
	selectedContact.isPrivate = addForm.private.checked;
	
	if(userOnlyAddresses === true){
		reloadAddressListUser();
	}else{
		reloadAddressListAll();
	}
	
	updateButtons.remove();
	
	addScreen.style.display = "none";
	mainScreen.style.display = "block";
	header.style.display = "block";
});

deleteButton.addEventListener("click", (e) => {
	let owner = getOwner(selectedContact);
	for(let i = 0; i<owner.contacts.length; i++){
		if(owner.contacts[i] == selectedContact){
			owner.contacts.splice(i,1);
		}
	}
	
	if(userOnlyAddresses === true){
		reloadAddressListUser();
	}else{
		reloadAddressListAll();
	}
	updateMap();
	
	updateButtons.remove();
	
	addScreen.style.display = "none";
	mainScreen.style.display = "block";
	header.style.display = "block";
});