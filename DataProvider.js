"use strict";
var fs = require("fs");

class DataProvider {
	constructor(dataStorage) {
		this.dataStorage = dataStorage;
	}

	getMieterItems() {
	    if (!this.cache) {
	        this.cache = this.dataStorage.getMieterItems();
	    }
	    var result = this.cache;	    
	    return result;
	}

	addMieterItem(firstName, lastName, adress, plz, city, mail, tel, mobil,qrCodeData) {
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
        // if (description) {
        //     newItem.description = description;
        // }
        this.dataStorage.addMieterItem(newItem);
        this.updateCache();
        return newItem;
    }

    updateCache() {
        this.cache = this.dataStorage.getMieterItems();
    }

    deleteMieter(id) {
        var result = this.dataStorage.deleteItem(id);
        this.updateCache();
        return result;
    }

    /////// SCHWARZES BRETT ///////

    addSBItem(titel, verfasser, erstellDatumISO, erstellDatumFormated, erstellZeit, verfallsDatum, nachricht) {
        var newItem = {
            titel: titel,
            verfasser: verfasser,
            erstellDatumISO: erstellDatumISO,
            erstellDatumFormated: erstellDatumFormated,
            erstellZeit: erstellZeit,
            verfallsDatum: verfallsDatum,
            nachricht: nachricht
        };
        // if (description) {
        //     newItem.description = description;
        // }
        this.dataStorage.addSBItem(newItem);
        // this.updateCache();
        return newItem;
    }

    getSBItems() {        
        var result = this.dataStorage.getSBItems();        
        return result;
    }

    deleteSBItem(id) {
        var result = this.dataStorage.deleteSBItem(id);
        return result;
    }


    /////// FORUM ///////

    addForumItem(titel, verfasser, erstellDatumISO, erstellDatumFormated, erstellZeit, nachricht) {
        var newItem = {
            titel: titel,
            verfasser: verfasser,
            erstellDatumISO: erstellDatumISO,
            erstellDatumFormated: erstellDatumFormated,
            erstellZeit: erstellZeit,
            nachricht: nachricht
        };
        // if (description) {
        //     newItem.description = description;
        // }
        this.dataStorage.addForumItem(newItem);
        // this.updateCache();
        return newItem;
    }

    getForumItems() {        
        var result = this.dataStorage.getForumItems();        
        return result;
    }

    deleteForumItem(id) {
        var result = this.dataStorage.deleteForumItem(id);
        return result;
    }

}

module.exports = DataProvider;