"use strict";
let models = require('../../server/models/index');
let graph = require('fbgraph');
let bcrypt = require('bcrypt');
let jwt = require('jwt-simple');
let config=require('../../server/config.json');
let user = require('../../modules/user/user');
let util = require('../../modules/util');
let Mailer = require('../../modules/notification/mailer');
let callbackcode = require('../../modules/config/error.json');
var GoogleAuth = require('google-auth-library');
let randomstring = require("randomstring");
let clientId = config.development.googleAuth.clientId;

module.exports = class auth{
	validateToken(authentication, callback) {
		if (authentication) {
        //let authentication = req.get('authentication');
        let [bearer, jwtToken] = authentication.split(' ');        
		//let decoded = jwt.decode(jwtToken,config.secret);    
		
			let decoded = jwt.decode(jwtToken, config.development.common.jwtSecret);
			if (decoded.exp < Date.now()) {
		    	callback(null,{status:'false',profileId:decoded.communicationId});
			} else {	
				callback(null, {status:'true',profileId:decoded.communicationId});
			}
		} 
	};
	_generateToken(profileId,callback) {
		 let payload = {
        	profileId : profileId,
        	issuerTag : config.development.common.issuerTag,
        	exp : Math.floor(new Date()/1000)+ (60 * 60 * 24 )
			};
		 let token  = jwt.encode(payload, config.development.common.jwtSecret);
		 callback(null, token);
	};

 }

