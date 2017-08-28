"use strict";
var config = require('../config/config.json');
//let models = require('../../server/models/index');
//let bcrypt = require('bcrypt');
let jwt = require('jwt-simple');

module.exports = class Auth{
	validateToken(authentication, callback) {
		if (authentication) {
        //let authentication = req.get('authentication');
        let [bearer, jwtToken] = authentication.split(' ');        
		//let decoded = jwt.decode(jwtToken,config.secret);    
		
			let decoded = jwt.decode(jwtToken, config.jwtSecret);
			if (decoded.exp < Date.now()) {
		    	callback(null,{status:'false',communicationId:decoded.communicationId});
			} else {	
				callback(null, {status:'true',communicationId:decoded.communicationId});
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

