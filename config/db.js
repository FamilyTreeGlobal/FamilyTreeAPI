"use strict";
let mysql = require("mysql");

let pool = mysql.createPool({
      connectionLimit : 100,
      host     : '45.40.164.65',
      port     :  3306,
      user     : 'familytreet2',
      password : 'Welcome123!@#',
      database : 'familytreet2',
  });


module.exports =  class Db{

    getConnection(callback){
      pool.getConnection(function(err, conn) {
        if(err) {
          return callback(err);
        }
        callback(null, conn);
      });
    }

}
