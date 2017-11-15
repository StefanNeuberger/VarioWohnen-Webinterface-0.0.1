var bodyParser = require('body-parser');
var express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var dataProvider = require("./DataProvider");
var dataStorage = require("./DataStorage");
var port = 9000;
var dataProv = new dataProvider(new dataStorage("mieter.json", "schwarzesBrett.json", "forum.json"));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/client')); // stellt dem client  den gesammten ordnerinhalt zur verfügung

server.listen(port, function () {
  console.log("Example app listening on port " + port +  "!")
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.post("/mieter", (reg, res) => {
    var newItem = reg.body;
    // if (!newItem.title) {
    //     res.status(400).send("Invalid todo item.")
    //     return;
    // }
    // if (dataProvider.getIsItemExisting(newItem.title)) {
    //     res.status(409).send("An item with the specified title exists already.");
    //     return;
    // }
    console.log("Received new Mieter item:");
    console.log(newItem);
    newItem = dataProv.addMieterItem(newItem.firstName, newItem.lastName, newItem.adress, newItem.plz, newItem.city, newItem.mail, newItem.tel, newItem.mobil, newItem.qrCodeData);
    res.send(newItem);
    io.emit("itemCreated", newItem); //NAchricht an alle verbundene clients
});

app.get("/mieter", (reg, res) => {
    res.send(dataProv.getMieterItems());
});

app.delete("/mieter/:id", (reg, res) => {    
    var id = parseInt(reg.params.id);
    console.log("id: " + id);
    if (!id || isNaN(id)) {
        res.status(400).send("No or invalid id");
        return;
    }
    var hasDeleted = dataProv.deleteMieter(id);
    res.status(200).send();
    if (hasDeleted) {
        io.emit("itemDeleted", {id: id});
    }
});


//////// SCHWARZES BRETT ////////////


app.post("/SB", (reg, res) => {
    var newItem = reg.body;
    // if (!newItem.title) {
    //     res.status(400).send("Invalid todo item.")
    //     return;
    // }
    // if (dataProvider.getIsItemExisting(newItem.title)) {
    //     res.status(409).send("An item with the specified title exists already.");
    //     return;
    // }
    console.log("Received new schwarzesBrettNachricht item:");
    console.log(newItem);
    newItem = dataProv.addSBItem(newItem.titel, newItem.verfasser, newItem.erstellDatumISO, 
                newItem.erstellDatumFormated, newItem.erstellZeit, newItem.verfallsDatum, newItem.nachricht);
    res.send(newItem);
    io.emit("brettItemCreated", newItem); //NAchricht an alle verbundene clients
});

app.get("/SB", (reg, res) => {
    res.send(dataProv.getSBItems());
});

app.delete("/SB/:id", (reg, res) => {  
    console.log("in delete/SB");  
    var id = parseInt(reg.params.id);
    console.log("id: " + id);
    if (!id || isNaN(id)) {
        res.status(400).send("No or invalid id");
        return;
    }
    var hasDeleted = dataProv.deleteSBItem(id);
    res.status(200).send();
    if (hasDeleted) {
        io.emit("itemDeleted", {id: id});
    }
});


//////// FORUM ////////////


app.post("/forum", (reg, res) => {
    var newItem = reg.body;
    // if (!newItem.title) {
    //     res.status(400).send("Invalid todo item.")
    //     return;
    // }
    // if (dataProvider.getIsItemExisting(newItem.title)) {
    //     res.status(409).send("An item with the specified title exists already.");
    //     return;
    // }
    console.log("Received new forum item:");
    console.log(newItem);
    newItem = dataProv.addForumItem(newItem.titel, newItem.verfasser, newItem.erstellDatumISO, 
                newItem.erstellDatumFormated, newItem.erstellZeit, newItem.nachricht);
    res.send(newItem);
    io.emit("forumItemCreated", newItem); //NAchricht an alle verbundene clients
});

app.get("/forum", (reg, res) => {
    res.send(dataProv.getForumItems());
});

app.delete("/forumItem/:id", (reg, res) => {    
    var id = parseInt(reg.params.id);
    console.log("id: " + id);
    if (!id || isNaN(id)) {
        res.status(400).send("No or invalid id");
        return;
    }
    var hasDeleted = dataProv.deleteForumItem(id);
    res.status(200).send();
    if (hasDeleted) {
        io.emit("itemDeleted", {id: id});
    }
});