require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
let jwt = require('jwt-simple');
var path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes
app.get('/',function(req,res){
  res.render('index', { title: 'Family Tree' });
});   

 
app.use('/users', require('./controllers/users.controller'));

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

//use JWT auth to secure the api, the token can be passed in the authorization header or querystring
// app.use(expressJwt({
//     secret: config.secret,
//     getToken: function (req) {       
//         let authentication = req.get('authentication');
//         let [bearer, jwtToken] = authentication.split(' ');        
//         let decoded = jwt.decode(jwtToken,config.secret);    
//         console.log('Email:'+decoded.Email)    ;
//         return jwtToken;
//         // if (req.get('authentication') && req.headers.authorization.split(' ')[0] === 'Bearer') {
//         //     return req.headers.authorization.split(' ')[1];
//         // } else if (req.query && req.query.token) {
//         //     return req.query.token;
//         // }
//         // return null;
//     }
// }).unless({ path: ['/users/authenticate', '/users/register'] }));

// app.use(function (req, res, next) {
//     console.log(req.headers);
//     console.log(req.headers.authentication);
//     let authentication = req.headers.get('authentication');
//     let [bearer, jwtToken] = authentication.split(' ');        
//     let decoded = jwt.decode(jwtToken,config.secret);    
//     console.log('Email:'+decoded.Email)    ;
//     if(decoded)
//     {next()}
//     else{res.sendStatus(401);}
// })

