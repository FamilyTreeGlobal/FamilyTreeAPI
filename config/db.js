"use strict";
let mysql = require("mysql");

let pool = mysql.createPool({
      connectionLimit : 100,
      host     : 'xxx.34.34.33',
      port     :  3306,
      user     : 'root',
      password : 'Passw0rd',
      database : 'XXX',
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
