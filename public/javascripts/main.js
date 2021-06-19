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
const backButton = document.getElementById("back-button");
backButton.remove();
const ownerSelect = document.getElementById("owner-select");

var map;
var mitte;

// var isLoggedIn = false;
// var isAdmina = false;

function User(username, isAdmin){
	this.username = username;
	this.isAdmin = isAdmin;

	var option = document.createElement("option");
	option.appendChild(document.createTextNode(username));
	addForm.owner.appendChild(option);
}

var admina = new User("admina", true);
var normalo = new User("normalo", false);
//Alle hardcoded nutzer (admina, normalo)
var users = [admina, normalo];

function Contact(firstname, lastname, street, streetnr, zip, city, state, country, isPrivate, owner) {
  this.firstname = firstname;
  this.lastname = lastname;
  this.street = street;
  this.streetnr = streetnr;
  this.zip = zip;
  this.city = city;
  this.state = state;
  this.country = country;
  this.isPrivate = isPrivate;
  this.markerGenerated = false;
  this.owner = owner;
  //Ersetzt durch methoden fullname(contact), und address(contact)
  //this.fullname = firstname + " " + lastname;
  //this.address = street + " " + streetnr + " " + zip + " " + city;
}
function fullname(contact){
	return contact.firstname + " " + contact.lastname;
}
function address(contact){
	return contact.street + " " + contact.streetnr + " " + contact.zip +" " + contact.city;
}

var contact1 = new Contact("Peter", "Peterson", "Treskowallee", "8", "10318",
                          "Berlin", "Berlin", "Germany", true, admina);
var contact2 = new Contact("A2", "B2", "Wilhelminenhofstraße", "75", "12459",
                            "Berlin", "Berlin", "Germany", false, admina);
var contact3 = new Contact("A3", "B3", "Straße des 17. Juni", "135", "10623",
                          "Berlin", "Berlin", "Germany", true, normalo);
var contact4 = new Contact("A4", "B4", "Kaiserswerther Str.", "16", "14195",
                            "Berlin", "Berlin", "Germany", false, normalo);

//Alle Kontakte
var contacts = [contact1, contact2, contact3, contact4];

//Aktuell angemeldeter Nutzer
var currUser;
//Ist aktuell geladene Address Liste nur fuer den aktuellen Nutzer
var userOnlyAddresses = true;
//Aktuell ausgewaehlter Kontakt
var selectedContact;

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
//Setzt den wert des gegebenen Feldes und setzt den valid Flag dieses Feldes
function setValue(field, value){
	field.value = value;
	field.valid = field.checkValidity();
}

createForm([loginForm.username, loginForm.password],[loginButton]);
createForm([addForm.firstname, addForm.lastname, addForm.street, addForm.streetnr, addForm.zip, addForm.city],[addButtons,updateButton]);

//Login fuer gegebene Werte im loginForm
loginButton.addEventListener("click", (e) => {
	e.preventDefault();
	const username = loginForm.username.value;
	const password = loginForm.password.value;

	let loginCorrect = false;

	let httpRequest = new XMLHttpRequest();
	let url = "http://localhost:3000/users";

	httpRequest.open("POST", url, true);
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	httpRequest.onerror = function() {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
			console.log("Connecting to server with " + url + " failed!\n");
	};

	httpRequest.onreadystatechange = function() {//Call a function when the state changes.
		if(httpRequest.readyState == 4 && httpRequest.status == 200) {
				//Setze Login war korrekt
				loginCorrect = true;

				// let pojo = JSON.parse(httpRequest.responseText);
				//Setze aktuellen User
				currUser = JSON.parse(httpRequest.responseText);
				if (currUser.isAdmin)
					currUser = admina;
				else
					currUser = normalo;

				//Wechsel zu mainScreen
				loginScreen.style.display = "none";
				mainScreen.style.display = "block";
				//Zeige Header mit Begruessung und Logout Button
				header.style.display = "block";
				headerInfo.innerHTML = "Hello "+currUser.username+"!";
				//Lade Karten Marker und Kontaktliste
				reloadAddressListUser();
				loadMarkers();
				//Entferne Admin Felder fuer Normalo
				if(!currUser.isAdmin){
					ownerSelect.remove();
				}
		}
	};

	httpRequest.send(`username=${username}&password=${password}`);

	setTimeout(function(){(loginCorrect) ? alert("You have successfully logged in") : alert("Wrong username or password!");}, 100);
});

//Logout fuer den aktuellen nutzer, wechsel zu login screen
logoutButton.addEventListener("click", (e) => {
  //isLoggedIn = false;
  //isAdmina = false;
 	mainScreen.style.display = "none";
  	header.style.display = "none";
 	loginScreen.style.display = "block";

	userOnlyAddresses = true;

	if(!currUser.isAdmin){
		addForm.insertBefore(ownerSelect, document.getElementById("private-row"));
	}

	for(let contact of contacts){
		setMarker(contact, false);
	}


	setValue(loginForm.password, "");
	loginButton.disabled = true;
});

//Lade alle Kontakte des aktuellen Nutzers
document.getElementById("show-my-button").addEventListener("click",(e) => {
	reloadAddressListUser();
});

//Lade alle Kontakte des aktuellen Nutzers sowie alle public Kontakte anderer Nutzer
document.getElementById("show-all-button").addEventListener("click", (e) => {
	reloadAddressListAll();
});

function reloadAddressList(){
	addressList.innerHTML = "";
	for (let contact of contacts) {
		if(contact.owner === currUser){
			addToAddressList(contact);
		}
	}
}

//Laedt die address Liste fuer den aktuellen Nutzer
function reloadAddressListUser() {
	reloadAddressList();

	if(userOnlyAddresses === false){
		for(let contact of contacts){
			if(contact.owner !== currUser && (currUser.isAdmin === true || contact.isPrivate === false)){
				setMarker(contact, false);
			}
		}
	}

	userOnlyAddresses = true;
}

//Laedt die Adress Liste neu
//Wenn Admin inklusive aller anderen Adressen, ansonsten nur publik Adressen
function reloadAddressListAll(){
	reloadAddressList();

	for(let contact of contacts){
		if(contact.owner !== currUser && (currUser.isAdmin === true || contact.isPrivate === false)){
			addToAddressList(contact);
			if(userOnlyAddresses === true){
				setMarker(contact);
			}
		}
	}
	userOnlyAddresses = false;
}

//Fuegt den spezifizierten Kontakt zur Addressliste des MainScreens hinzu
//Gegebebenen Falls wird der Bearbeiten Screen fuer den Kontakt freigeschaltet
function addToAddressList(contact){
	//addressList.innerHTML += '<li class="address">' + contact.fullname + '</li>';
	let addressLi = document.createElement("li");
	addressLi.innerHTML = fullname(contact);
	addressLi.className = "address";

	addressLi.addEventListener("click", (e) => {

		if(currUser.isAdmin == false && contact.owner.username !== currUser.username){
			addForm.appendChild(backButton);
		}else{
			selectedContact = contact;
			updateButton.disabled = false;
			addForm.appendChild(updateButtons);
		}

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
				if(contact.owner === users[i]){
					addForm.owner.selectedIndex = i;
					break;
				}
			}
			/*for(let i = 0; i<users.length; i++){
				for(let userContact of users[i].contacts){
					if(userContact === contact){
						addForm.owner.selectedIndex = i;
						break;
					}
				}
			}*/
		}

		mainScreen.style.display = "none";
		header.style.display = "none";
		addScreen.style.display = "block";
	});
	addressList.appendChild(addressLi);
}

//Gibt den owner des gegebenen Kontakts zurueck
function getOwner(contact){
	console.log("!Deprecated method called: getOwner(contact)!");
	return contact.owner;
	/*for(let i = 0; i<users.length; i++){
		for(let userContact of users[i].contacts){
			if(userContact === contact){
				return users[i];
			}
		}
	}
	*/
}

//Inizialisiert die Karte mit einem Marker in Berlin Mitte
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
	title: "Berlin Mitte",
  });
}

//Aktualisiert die Karte in dem ein Marker fuer jeden Kontakt hinzugefuegt wird
function loadMarkers() {
	for (let contact of contacts) {
		if(contact.owner === currUser){
			setMarker(contact);
		}
	}
}

//Fuegt einen Marker auf der Karte fuer den gegebenen Kontak hinzu
//Gibt entsprechenden alert wenn kein Marker erstellt werden konnte
//Wird visible auf true gesetzt oder nicht spezifiziert, wird der Marker sobald er erstellt wurde auf der Karte angezeigt
function setMarker(contact, visible){

	let selMap = null;
	if(visible === true || visible === undefined){
		selMap = map;
	}

	if(contact.markerGenerated === true){
		try{
			contact.marker.setMap(selMap);
		}catch(e){

		}
	}else{

		var xhr = new XMLHttpRequest();
		var url = "https://maps.googleapis.com/maps/api/geocode/json?";
		url = url + "address=" + address(contact);
		url = url +"&key=AIzaSyCiWbb2a4ZQMkVw1xJ5U2WMPvomDWeCZHY";
		xhr.open("GET", url, true);
		// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
		xhr.onerror = function(){
			alert("Connecting to server with " + url + " failed!\n");
		};
		// diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
		xhr.onload = function(e){
			var data = this.response;
			var obj = JSON.parse(data);
			console.log(obj);
			if(this.status == 200){
				if(obj.status == "ZERO_RESULTS"){
					alert("The address could not be resolved");
					contact.markerGenerated = true;
				}else{
					const mkr = new google.maps.Marker({
						position: {lat: obj.results[0].geometry.location.lat, lng:	obj.results[0].geometry.location.lng},
						map: selMap,
						title: fullname(contact)
					});
					contact.marker = mkr;
					contact.markerGenerated = true;
				}
			}else{
				alert ("HTTP-status code was: " + obj.status);
			}
		}
		xhr.send();
	}
}

//Wechselt in den add Contact screen
addNewButton.addEventListener("click", (e) => {

	addButtons.disabled = true;

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

//Fuegt den durch das addForm spezifiezierten Kontakt hinzu
addButtons.addEventListener("click", (e) => {

	let owner = currUser;
	if(currUser.isAdmin){
		owner = users[addForm.owner.selectedIndex];
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
			owner
		);

	if(userOnlyAddresses && owner!==currUser){
		setMarker(contactInput, false);
	}else{
		setMarker(contactInput);
		addToAddressList(contactInput);
	}

	contacts.push(contactInput);

	addButtons.remove();

	addScreen.style.display = "none";
	mainScreen.style.display = "block";
	header.style.display = "block";
});

//Aktuellisiert den ausgewaehlten Kontakt durch die im addForm
//gewaehlten spezifikationen
updateButton.addEventListener("click", (e) => {

	var addressChanged = false;
	if(selectedContact.street != addForm.street.value
		|| selectedContact.streetnr != addForm.streetnr.value
		|| selectedContact.zip != addForm.zip.value
		|| selectedContact.city != addForm.city.value){

		addressChanged = true;
	}

	selectedContact.firstname = addForm.firstname.value;
	selectedContact.lastname = addForm.lastname.value;

	selectedContact.marker.setTitle(fullname(selectedContact));

	selectedContact.street = addForm.street.value;
	selectedContact.streetnr = addForm.streetnr.value;
	selectedContact.zip = addForm.zip.value;
	selectedContact.city = addForm.city.value;
	selectedContact.state = addForm.state.value;
	selectedContact.country = addForm.country.value;
	selectedContact.isPrivate = addForm.private.checked;
	if(currUser.isAdmin === true){
		selectedContact.owner = users[addForm.owner.selectedIndex];
		if(selectedContact.owner !== currUser && userOnlyAddresses){
			selectedContact.marker.setMap(null);
		}
	}else{
		selectedContact.owner = currUser;
	}

	if(addressChanged === true){
		selectedContact.marker.setMap(null);
		selectedContact.markerGenerated = false;
		setMarker(selectedContact);
	}

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

//Loescht den ausgewaehlten Kontakt
deleteButton.addEventListener("click", (e) => {
	selectedContact.marker.setMap(null);

	for(let i = 0; i<contacts.length; i++){
		if(contacts[i] === selectedContact){
			contacts.splice(i,1);
		}
	}

	/*let owner = getOwner(selectedContact);
	for(let i = 0; i<owner.contacts.length; i++){
		if(owner.contacts[i] == selectedContact){
			owner.contacts.splice(i,1);
		}
	}*/

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

//Kehrt vom Update- zum MainScreen zurueck
backButton.addEventListener("click", (e) => {
	backButton.remove();

	addScreen.style.display = "none";
	mainScreen.style.display = "block";
	header.style.display = "block";
});
