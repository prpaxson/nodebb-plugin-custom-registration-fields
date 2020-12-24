"use strict";

var plugin = {};
var meta = require.main.require('./src/meta');

plugin.init = function(params, callback) {
	var app = params.router,
		middleware = params.middleware,
		controllers = params.controllers;
	
	callback();
};

plugin.addFields = function(params, callback) {

	var firstname = {
		label: 'First Name',
		html: '<input class="form-control" type="text" name="firstname" id="firstname" placeholder="First Name">\
		<span class="help-block">Enter your first name.</span>'
	};

	var lastname = {
		label: 'Last Name',
		html: '<input class="form-control" type="text" name="lastname" id="lastname" placeholder="Last Name">\
		<span class="help-block">Enter your last name.</span>'
	};

	var zip = {
		label: 'ZIP Code',
		html: '<input class="form-control" type="text" name="zip" id="zip" placeholder="ZIP Code">\
		<span class="help-block">Enter your ZIP code.</span>'
	};

	var pets = {
		label: 'Pets',
		html: '<input type="checkbox" name="dog" id="dog" value="dog">\
		<label for="dog"> Dog</label><br>\
		<input type="checkbox" name="cat" id="cat" value="cat">\
		<label for="cat"> Cat</label><br>\
		<input type="checkbox" name="other" id="other" value="other">\
		<label for="other"> Other</label><br>\
		<span class="help-block">Select the pets you own.</span>'
	};

	if (params.templateData.regFormEntry && Array.isArray(params.templateData.regFormEntry)) {
		params.templateData.regFormEntry.push(firstname);
		params.templateData.regFormEntry.push(lastname);
		params.templateData.regFormEntry.push(zip);
		params.templateData.regFormEntry.push(pets);
	} else {
		params.templateData.firstname = firstname;
		params.templateData.lastname = lastname;
		params.templateData.lastname = zip;
		params.templateData.lastname = pets;		
	}

	callback(null, params);
};

plugin.checkRegister = function(params, callback) {
	var answer = String(meta.config['registration-question:answer']);

	if (answer.toLowerCase() !== params.req.body['registration-question'].toLowerCase()) {
		callback({source: 'registration-question', message: 'wrong-answer'}, params);
	} else {
		callback(null, params);
	}
};

module.exports = plugin;
