﻿var config = require('../config/config.json');
var _ = require('lodash');
let jwt = require('jwt-simple');
var bcrypt = require('bcryptjs');
var Q = require('q');
let db = require("../config/db.js");
const uuidv1 = require('uuid/v1');

var service = {};

service.authenticate = authenticate;
//service.getUsersList = getUsersList;
//service.getById = getById;
service.create = create;
//service.update = update;
//service.delete = _delete;

module.exports = service;

function authenticate(username, password,callback) {    
    let db_connect = new db();
    var deferred = Q.defer();   
    db_connect.getConnection(function (err, conn) {
        if (err)
            deferred.resolve('Could not connect to database');
        if(conn)
            {
                conn.query('select ft_profileId,email,fullname,password from tbl_members where email=?  AND status =? ', [username,1], function (err, rows) {
                    if (err)  
                           callback(err.name + ': ' + err.message, null);                
                    if (rows.length > 0) {
                         conn.release();
                        let user = rows[0];                          
                        if(bcrypt.compareSync(password, user.password)) {                        
                       
                            let payload = {
                            issuerTag: config.authenticationIssuerTag,
                            communicationId:user.ft_profileId,
                            exp: Math.floor(new Date().getTime() + 60 * 60 * 24 * 1000)
                            };
                            let jwt_token = jwt.encode(payload, config.secret);
                            console.log('inside1')
                            let result = JSON.stringify({ status: 200, username: user.fullname,token: jwt_token });
                            callback(null, result);                            
                        } else {
                            callback('Invalid Password', null);
                        }
                    }else{callback('Invalid User', null);}
                });
                
          }
      });
     
    
}


function create(user,callback) {
    var deferred = Q.defer();
    let profileId=uuidv1();
    let db_connect = new db();
   // console.log('profileid:'+user);
    
    // validation    
    db_connect.getConnection(function (err, conn) {
        if (err)
            callback('Could not connect to database',null);
        if(conn)
            {
                let passwordHash = bcrypt.hashSync(user.password, 10);
                console.log('passwordHash:'+passwordHash);
                let strQuery='call createuser(?, ?, ?, ?, ?, ?, ?,?)';
                conn.query(strQuery,[user.fullname, user.surname, user.gender,user.dob, user.email,passwordHash, profileId,user.maritalstatus], function(err, result) { 
                    conn.release();
                     if (err) throw err; 
                     if(result)
                        {
                            var currentData=JSON.parse(JSON.stringify(result[0]))[0];
                            console.log(currentData.response);
                            callback(null,currentData.response);                            
                        }
                        
                    
                });
          }
       
    });
}