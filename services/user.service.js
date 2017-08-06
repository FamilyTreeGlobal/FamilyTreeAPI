var config = require('config.json');
var _ = require('lodash');
let jwt = require('jwt-simple');
var bcrypt = require('bcryptjs');
var Q = require('q');
let db = require("../config/db.js");
//var mongo = require('mongoskin');
//var db = mongo.db(config.connectionString, { native_parser: true });
//db.bind('UserInfo');

var service = {};

service.authenticate = authenticate;
service.getUsersList = getUsersList;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {    
    let db_connect = new db();
    var deferred = Q.defer();   
    deferred.resolve({
                    profileId:"3242",
                    username: "JagadeeswararaoChappa",
                    firstName: "firstName",
                    lastName:"lastname",
                    token: "jwt_token"
                });
         return deferred.promise;
   /*   db_connect.getConnection(function (err, conn) {
        if (err)
            deferred.resolve('Could not connect to database');
        if(conn)
            {
                conn.query('select id,emailAddress,password,profileId from userinfo where username=? OR phoneNumber=? AND status =? ', [username, username,1], function (err, rows) {
                    if (err) 
                        deferred.reject(err.name + ': ' + err.message);
                    if (rows.length > 0) {
                        conn.release();
                        let user = rows[0];                        
                        if (passwordHash.verify(password, user.hashedPassword)) {
                            let payload = {
                            issuerTag: config.authenticationIssuerTag,
                            exp: Math.floor(new Date().getTime() + 60 * 60 * 24 * 1000)
                            };
                            let jwt_token = jwt.encode(payload, config.jwt.secret);
                            deferred.resolve({
                                profileId:user.profileId,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                token: jwt_token
                            });
                        } else {
                            deferred.resolve();
                        }
                    }
                });
                return deferred.promise;
          }
      });*/
     
    
}

function getUsersList() {
    var deferred = Q.defer();

    db.UserInfo.find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();
    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    return deferred.promise;
}

function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
            return deferred.promise;
    }

    
function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}