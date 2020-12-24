"use strict";

var customFields = {
		firstname : "", 
		lastname : "",
		zip : "",
		dog : false,
		cat : false,
		other : false
	},
	customData = [],
	user = module.parent.require('./user'),
	db = module.parent.require('./database'),
	meta = require.main.require('./src/meta'),
	plugin = {};

plugin.init = function(params, callback) {
	var app = params.router,
		middleware = params.middleware,
		controllers = params.controllers;
	
	callback();
};

plugin.addFields = function(params, callback) {

	var firstname = {
		label: 'First Name',
		html: '<input class="form-control" type="text" name="firstname" id="firstname" placeholder="First Name">'
	};

	var lastname = {
		label: 'Last Name',
		html: '<input class="form-control" type="text" name="lastname" id="lastname" placeholder="Last Name">'
	};

	var zip = {
		label: 'ZIP Code',
		html: '<input class="form-control" type="text" name="zip" id="zip" placeholder="ZIP Code">\
		<span class="help-block">SearchPaws is currently limited to the US.</span>'
	};

	var pets = {
		label: 'Pets',
		html: '<input type="checkbox" name="dog" id="dog" value="dog">\
		<label for="dog"> Dog</label><br>\
		<input type="checkbox" name="cat" id="cat" value="cat">\
		<label for="cat"> Cat</label><br>\
		<input type="checkbox" name="other" id="other" value="other">\
		<label for="other"> Other</label><br>\
		<span class="help-block">Select all that apply.</span>'
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
	var userData = params.userData;
    var error = null;

    for(var key in customFields) {

        var value = userData[key];

		if (value == "" || value == undefined) {
            error = {message: 'Please complete all fields before registering.'};
        }
    }

    callback(error, params);
};

plugin.creatingUser = function(params, callback) {
    customData = params.data.customRows;

    callback(null, params);
};

plugin.createdUser = function(params) {
    var addCustomData = {
        npi : customData[0].value, 
        institution : customData[1].value,
        practicetype : customData[2].value,
        specialty : customData[3].value,
        practiceyears : customData[4].value
    }

    var keyID = 'user:' + params.uid + ':ns:custom_fields';

    db.setObject(keyID, addCustomData, function(err) {
        if (err) {
            return callback(err);
        }
    });
};

plugin.customHeaders = function(headers, callback) {
	headers.headers.push({
        label: "First Name"
	});
	headers.headers.push({
        label: "Last Name"
	});
	headers.headers.push({
        label: "ZIP Code"
	});
	headers.headers.push({
        label: "Pets"
    });

    callback(null, headers);
};

plugin.customFields = function(params, callback) {    
    var users = params.users.map(function(user) {

        if (!user.customRows) {
            user.customRows = [];

            for(var key in customFields) {
                user.customRows.push({value: customFields[key]});
            }
        }

        return user;
    });

    callback(null, {users: users});
};

plugin.addToApprovalQueue = function(params, callback) {
    var data = params.data;
    var userData = params.userData;

    data.customRows = [];

    for (var key in customFields) {

        switch(key) {
            case 'firstname':
                var fieldData = params.userData['firstname'];
                break;
            
            case 'lastname':
                var fieldData = params.userData['lastname'];
                break;
            
            case 'zip':
                var fieldData = params.userData['zip'];
                break;
            
            case 'dog':
                var fieldData = params.userData['dog'];
                break;
            
            case 'cat':
                var fieldData = params.userData['cat'];
				break;

			case 'other':
                var fieldData = params.userData['cat'];
                break;
        }
        
        customFields[key] = fieldData;
        data.customRows.push({value: customFields[key]});
    }

    callback(null, {data: data, userData: userData});
};

module.exports = plugin;
