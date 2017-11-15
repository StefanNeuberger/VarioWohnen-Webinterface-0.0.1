"use strict";
var fs = require("fs");

class DataStorage {
	constructor(filePathMieter, filePathSchwarzesBrett, filePathForum) {
		this.filePathMieter = filePathMieter;
		this.filePathSchwarzesBrett = filePathSchwarzesBrett;
		this.filePathForum = filePathForum;

		fs.stat(this.filePathMieter, (err, stat) => {
			if (err) {
				console.log("Creating empty file for Mieter under " + this.filePathMieter);
				fs.writeFileSync(this.filePathMieter, JSON.stringify([]));
			}
		});
		fs.stat(this.filePathSchwarzesBrett, (err, stat) => {
			if (err) {
				console.log("Creating empty file for SchwarzesBrett under " + this.filePathSchwarzesBrett);
				fs.writeFileSync(this.filePathSchwarzesBrett, JSON.stringify([]));
			}
		});
		fs.stat(this.filePathForum, (err, stat) => {
			if (err) {
				console.log("Creating empty file for Forum under " + this.filePathForum);
				fs.writeFileSync(this.filePathForum, JSON.stringify([]));
			}
		});
	}

	getMieterItems() {
        var json = fs.readFileSync(this.filePathMieter, "utf8");
        return JSON.parse(json);
    }

    getNextId(items) {
        var lastItem = items[items.length - 1];
        if (lastItem) {
            return lastItem.id + 1;
        }
        return 1;
    }

	addMieterItem(newItem) {
	    var allMieter = this.getMieterItems();
	    
	    newItem.id = this.getNextId(allMieter);
	    allMieter.push(newItem);
	    this.updateMieterFile(allMieter);
	    
	    console.log("Stored new item:");
	    console.log(newItem);
	    return newItem;
	}	

	updateMieterFile(items) {
        var json = JSON.stringify(items);
        fs.writeFileSync(this.filePathMieter, json);
    }

    deleteItem(id) {
        var allMieter = this.getMieterItems();
        var existingMieter = allMieter.filter(i => i.id == id)[0];
        if (!existingMieter) {
            return false;
        }
        allMieter.splice(allMieter.indexOf(existingMieter), 1);
        this.updateMieterFile(allMieter);
        console.log("Item deleted:");
        console.log(existingMieter);
        return true;
    }

    ///////// SCHWARZE BRETT ////////////

    addSBItem(newItem) {
        var allSBItems = this.getSBItems();
        
        newItem.id = this.getNextId(allSBItems);
        allSBItems.push(newItem);
        this.updateSBFile(allSBItems);
        
        console.log("Stored new item:");
        console.log(newItem);
        return newItem;
    }

    getSBItems() {
        var json = fs.readFileSync(this.filePathSchwarzesBrett, "utf8");
        return JSON.parse(json);
    }

    updateSBFile(items) {
        var json = JSON.stringify(items);
        fs.writeFileSync(this.filePathSchwarzesBrett, json);
    }

    deleteSBItem(id) {
        var allSBItems = this.getSBItems();
        var existingSBItem = allSBItems.filter(i => i.id == id)[0];
        if (!existingSBItem) {
            return false;
        }
        allSBItems.splice(allSBItems.indexOf(existingSBItem), 1);
        this.updateSBFile(allSBItems);
        console.log("Item deleted:");
        console.log(existingSBItem);
        return true;
    }


    ///////// FORUM ////////////

    addForumItem(newItem) {
        var allForumItems = this.getForumItems();
        
        newItem.id = this.getNextId(allForumItems);
        allForumItems.push(newItem);
        this.updateForumFile(allForumItems);
        
        console.log("Stored new item:");
        console.log(newItem);
        return newItem;
    }

    getForumItems() {
        var json = fs.readFileSync(this.filePathForum, "utf8");
        return JSON.parse(json);
    }

    updateForumFile(items) {
        var json = JSON.stringify(items);
        fs.writeFileSync(this.filePathForum, json);
    }

    deleteForumItem(id) {
        var allForumItems = this.getSBItems();
        var existingForumItem = allForumItems.filter(i => i.id == id)[0];
        if (!existingForumItem) {
            return false;
        }
        allForumItems.splice(allForumItems.indexOf(existingForumItem), 1);
        this.updateForumFile(allForumItems);
        console.log("Item deleted:");
        console.log(existingForumItem);
        return true;
    }

}

module.exports = DataStorage;