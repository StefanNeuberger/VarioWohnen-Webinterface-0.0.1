// Übergabeparameter für HTTP Methoden
var mieter = "/mieter";
var schwarzesBrett = "/SB";
var forum = "/forum";

// onClick Funktionalität der Menü Leiste
$('body').on('click', '#btn-mieter-load', e=> loadMieter());
$('body').on('click', '#btn-SB-load', e=> loadSB());

var socket = io.connect("/");

socket.on("connect", ()=>{
    console.log("Successfully connected to socket.io server.");
});

socket.on("itemCreated", data => {
   	console.log("Item created:");
    console.log(data);
});

// HTTP Methoden
function getItem(itemCategorie, callback){
    var request = new XMLHttpRequest();
    request.open("GET", itemCategorie);
    request.addEventListener('load', function(event) {      // CALLBACK aufruf erst wenn LOAD rückgabe.
        if (request.status == 200) {
            var data = JSON.parse(request.responseText);
            console.info(data);
            callback(data);
        } else {
            console.error(request.statusText, request.responseText);
        }
    });
    request.send();     // wird asugeführt auch wen eventlistener noch nicht load
}

function deleteItem(itemCategorie, id){
	var request = new XMLHttpRequest();
    $('.item-card-container').filter('[item-id='+id+']').remove();
   	request.open("DELETE", itemCategorie + "/" + id);
   	request.addEventListener('load', function(event) {
      	if (request.status == 200) {
        	console.info(request.responseText);
      	} else {
         	console.error(request.statusText, request.responseText);
      	}
   	});
	request.send();
}

function addMieter(firstName, lastName, adress, plz, city, mail, tel, mobil, qrCodeData){
	var request = new XMLHttpRequest();
   	request.open("POST","/mieter");
   	request.setRequestHeader("Content-type","application/json");
   	request.addEventListener('load', function(event) {
      	if (request.status == 200) {
        	console.info(request.responseText);
          	var data = JSON.parse(request.responseText);
          	addMieterToList(data);
      	} else {
        	console.error(request.statusText, request.responseText);
      	}
   	});
   	var newItem = { 
		firstName: firstName,
		lastName: lastName,
		adress: adress,
		plz: plz,
		city: city,
		mail: mail,
		tel: tel,
		mobil: mobil,
		qrCodeData: qrCodeData
   	};
   	request.send(JSON.stringify(newItem));
}

function addSchwarzesBrettNachricht(titel, verfasser, erstellDatumISO, erstellDatumFormated, erstellZeit, verfallsDatum, nachricht){
	var request = new XMLHttpRequest();
   	request.open("POST","/SB");
   	request.setRequestHeader("Content-type","application/json");
   	request.addEventListener('load', function(event) {
      	if (request.status == 200) {
        	console.info(request.responseText);
          	var data = JSON.parse(request.responseText);
          	addSBToList(data);
      	} else {
        	console.error(request.statusText, request.responseText);        	
      	}
   	});
   	var newItem = { 
		titel: titel,
		verfasser: verfasser,
		erstellDatumISO: erstellDatumISO,
		erstellDatumFormated: erstellDatumFormated,
		erstellZeit: erstellZeit,
		verfallsDatum: verfallsDatum,
		nachricht: nachricht
   	};
   	request.send(JSON.stringify(newItem));
}

// Speichert die Eingabedaten des "Mieter hinzufügen" Feldes
function getInputData() {
	fn = $("#first_name").val();
	ln = $("#last_name").val();
	adr = $("#mieter_adr").val();
	plz = $("#plz").val();
	city = $("#ort").val();
	mail = $("#email").val();
	tel = $("#telpriv").val();
	mob = $("#mobil").val();
	qrData = fn + ln + adr;
	$("#modal-mieter-fn").text(fn);
	$("#modal-mieter-ln").text(ln);
	$("#modal-mieter-adr").text(adr);
	$("#modal-mieter-city").text(city);
	$("#modal-mieter-plz").text(plz);
	$("#modal-mieter-mail").text(mail);
	$("#modal-mieter-telpriv").text(tel);
	$("#modal-mieter-mobil").text(mob);
}

// Aufruf der HTTP POST Methode und einfügen der Daten in MieterCard zur Darstellung im HtmL
function saveMieterAndConfirm() {
	$("#card-title").text(fn + " " + ln);
	$("#card-str").text(adr + ", " + plz + " " + city);
	$("#card-mail").text(mail);
	$("#card-tel").text(tel);
	$("#card-mobil").text(mob);
	// var qrURL = generateQRCodeURL(fn, ln, adr);
	// var qr = document.getElementById("qr-code");
	// qr.src = qrURL;
	addMieter(fn, ln, adr, plz, city, mail, tel, mob, qrData);
}

function generateQRCodeURL(fn, ln, adr) {
	return "http://api.qrserver.com/v1/create-qr-code/?data=" + fn + ln + adr + "&size=200x200";
}

// Aufruf der HTTP POST Methode für das Schwarze Brett
function saveSchwarzesBrettEntry() {
	var titel = $("#SB-titel").val();
	var nachricht = $("#SB-nachricht").val();
	var verfasser = "user1";
	var erstellDatumISO = getCurrentDate()[0];
	var erstellDatumFormated = getCurrentDate()[1];
	var erstellZeit = getCurrentTime();
	var verfallsDatum = $('#verfallsDatum-datePicker').val();	
	addSchwarzesBrettNachricht(titel, verfasser, erstellDatumISO, erstellDatumFormated, erstellZeit, verfallsDatum, nachricht);
	// addSBItemsToList(titel, verfasser, erstellDatumISO, erstellDatumFormated, erstellZeit, verfallsDatum, nachricht);
}

function getCurrentDate() {
	var date = new Date();
	var day = date.getDate();
	var monthNum = date.getMonth();
	var month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	var year = date.getFullYear();
	var resultISO = year + "-" + monthNum + 1 + "-" + day;
	var resultFormated = day + ". " + month[monthNum] + " " + year;
	var dateArray = [resultISO, resultFormated];
	return dateArray;
}

function getCurrentTime() {
	var date = new Date();
	var hour = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var result = hour + ":" + minutes + ":" + seconds;
	return result;
}

// Speichert die ID des HTML Elements von dem aus ein Löschaufruf gestartet wurde
function saveTargetId(id) {
	deleteItemId = id;
}

// mieter hinzufügen "Mieter anlegen" button
$("body").on("click", "#button-addMieter", e=> showMieterInputField());
$("body").on("click", "#btn-mieter-speichern", e=> getInputData());
$("body").on("click", "#btn-modal-speichern", e=> saveMieterAndConfirm());
// mieter Löschen
$("body").on("click", ".delete-mieter-button", e=> saveTargetId($(event.target).attr("item-id")));
$("body").on("click", "#btn-modal-Mieter-loeschen", e=> deleteItem(mieter, deleteItemId));
// SB neue nachricht speichern
$("body").on("click", "#button-save-schwarzesBrettNachricht", e=> saveSchwarzesBrettEntry());
// SB Nachricht löschen
$("body").on("click", ".delete-SBItem-button", e=> saveTargetId($(event.target).attr("item-id")));
$("body").on("click", "#btn-modal-SBItem-loeschen", e=> deleteItem(schwarzesBrett, deleteItemId));
$('.datepicker').pickadate({
	selectMonths: true, // Creates a dropdown to control month
   	selectYears: 15, // Creates a dropdown of 15 years to control year,
   	today: 'Today',
   	clear: 'Clear',
   	close: 'Ok',
  	closeOnSelect: false // Close upon selecting a date,
});
// forum neue nachricht speichern
$("body").on("click", "#button-save-forumNachricht", e=> saveForumEntry());

// AUTOCOMPLETE CITY ANHAND VON PLZ
$('#plz').bind('keyup change', function(e) {
    if ($(this).val().length > 4) {
        var ort = $('#ort');
        $.getJSON('http://www.geonames.org/postalCodeLookupJSON?&country=DE&callback=?', {postalcode: this.value }, function(response) {
            if (response && response.postalcodes.length && response.postalcodes[0].placeName) {
                ort.val(response.postalcodes[0].placeName);
            }
        })
    } else {
        $('#ort').val('');
    }
});

// MIETER

function loadMieter() {
	clearBeforeLoad();
	addActionButton("addMieter");
	addRowForDynamicContent();
	loadAllItems(mieter);
}

function loadSB() {
	clearBeforeLoad();
	addActionButton("addSB");
	addRowForDynamicContent();
	loadAllItems(schwarzesBrett);
}

function loadAllItems(itemCategorie) {
	if (itemCategorie === '/mieter') {
		getItem(itemCategorie, items => items.forEach(item => addMieterToList(item)));
	}
	if (itemCategorie === '/SB') {
		getItem(itemCategorie, items => items.forEach(item => addSBToList(item)));
	}	
}

function clearBeforeLoad() {
	var inputContainer = document.getElementById("input-container2");
	if (inputContainer.classList.contains("show")) {
		inputContainer.classList.remove("show");
	}
	var element = document.getElementById("item-list-row");
	element.parentNode.removeChild(element);
	document.getElementsByClassName('btn-floating btn-large red')[0].removeAttribute("id");
	var actionButton = document.getElementsByClassName('btn-floating btn-large red')[0];
	actionButton.removeAttribute("href");
	actionButton.classList.remove('modal-trigger');
	resetActionButtonSymbol();
	
}

function addActionButton(idValue) {
	var actionButton = document.getElementsByClassName('btn-floating btn-large red')[0];
	var href = "#modal-" + idValue;
	var idValue = "button-" + idValue;
	actionButton.setAttribute("id", idValue);
	if (idValue === 'button-addSB') {
		actionButton.setAttribute("href", href);
		actionButton.classList.add('modal-trigger');	
	}
}

function addRowForDynamicContent() {
	var dynContainer = document.getElementsByClassName('dynamic-content-container')[0];
	var row = document.createElement('div');
	row.className = 'row';
	row.setAttribute('id', 'item-list-row');
	dynContainer.appendChild(row);
}

function resetActionButtonSymbol() {	
	document.getElementById('action-button-symbol').textContent = "add";	
}

function changeActionButtonSymbol() {
	var container = document.getElementById('action-button-symbol');
	var symbol = document.getElementById('action-button-symbol').textContent;
	container.textContent = (symbol === "add") ? "remove" : "add";
}

function showMieterInputField() {	
	var mieterInputField = document.querySelector(".input-mieter2");
	mieterInputField.classList.toggle("show");
	changeActionButtonSymbol();	
}

// DYNAMISCHER INHALT MIETER
function addMieterToList(data) {

	var row = document.getElementById('item-list-row');

	var section = document.createElement("section");
	section.className = "item-card-container col s12 m6 l4";
	section.setAttribute("item-id", data.id);

	var card_blue = document.createElement("div");
	card_blue.className = "item-card card blue-grey darken-1";

	var card_content = document.createElement("div");
	card_content.className = "item-card-content white-text";

	var ul = document.createElement("ul");
	ul.className = "item-list";

	var li = document.createElement("li");
	li.className = "mieter-card-name";
	li.innerText = data.firstName + " " + data.lastName;
	ul.appendChild(li);

	var li2 = document.createElement("li");
	li2.className = "mieter-card-adr";
	li2.innerText = data.adress + ", " + data.plz + " " + data.city;
	ul.appendChild(li2);

	var li3 = document.createElement("li");
	li3.className = "mieter-card-mail";
	li3.innerText = data.mail;
	ul.appendChild(li3);

	var li4 = document.createElement("li");
	li4.className = "mieter-card-tel";
	li4.innerText = data.tel;
	ul.appendChild(li4);

	var li5 = document.createElement("li");
	li5.className = "mieter-card-mobil";
	li5.innerText = data.mobil;
	ul.appendChild(li5);

	var footer = document.createElement("div");
	footer.className = "card-action";

	var a1 = document.createElement("a");
	a1.className = "delete-mieter-button modal-trigger";
	a1.setAttribute("href", "#modal-mieterLoeschen");
	a1.setAttribute("item-id", data.id);
	a1.innerText = "Löschen";

	var a2 = document.createElement("a");
	a2.className = "edit-mieter-button";
	a2.setAttribute("href", "#");
	a2.innerText = "Bearbeiten";

	footer.appendChild(a1);
	footer.appendChild(a2);

	card_content.appendChild(ul);
	card_blue.appendChild(card_content);
	card_blue.appendChild(footer);
	section.appendChild(card_blue);

	row.appendChild(section);
}

// DYNAMISCHER INHALT SCHWARZES BRETT

function addSBToList(data) {

	var row = document.getElementById('item-list-row');

	var section = document.createElement("section");
	section.className = "item-card-container col s12";
	section.setAttribute("item-id", data.id);

	var card_blue = document.createElement("div");
	card_blue.className = "SBItem-card card blue-grey darken-1";

	var card_content = document.createElement("div");
	card_content.className = "card-content SB white-text";
	card_content.setAttribute("id", "card-content-SB");

	var ul = document.createElement("ul");
	ul.className = "SB-list-content";

	var li = document.createElement("li");
	li.className = "SB-header";

	var span1 = document.createElement("span");
	span1.className = "SB-card-title";
	span1.innerText = data.titel;
	li.appendChild(span1);

	var span2 = document.createElement("span");
	span2.className = "SB-card-verfasser";
	span2.innerText = data.verfasser + ", am  " + data.erstellDatumFormated + " um " + data.erstellZeit;
	li.appendChild(span2);

	ul.appendChild(li);

	var li2 = document.createElement("li");
	li2.className = "SB-card-nachricht";
	li2.innerText = data.nachricht;
	ul.appendChild(li2);	

	var footer = document.createElement("div");
	footer.className = "card-action";

	var a1 = document.createElement("a");
	a1.className = "delete-SBItem-button modal-trigger";
	a1.setAttribute("href", "#modal-delete-SB");
	a1.setAttribute("item-id", data.id);
	a1.innerText = "Löschen";

	var a2 = document.createElement("a");
	a2.className = "edit-SBItem-button";
	a2.setAttribute("href", "#");
	a2.innerText = "Bearbeiten";

	footer.appendChild(a1);
	footer.appendChild(a2);

	card_content.appendChild(ul);
	card_blue.appendChild(card_content);
	card_blue.appendChild(footer);
	section.appendChild(card_blue);

	row.appendChild(section);
}

$( document ).ready(function(){
	$(".button-collapse").sideNav();
	$('.modal').modal();
	loadAllItems(mieter);
	addActionButton("addMieter");	
});
