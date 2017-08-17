var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/getUsersList', getUsersList);

module.exports = router;

function authenticate(req, res) {
    console.log(req.body);
    userService.authenticate(req.body.username, req.body.password,function(err,user) {
      //res.send(result);
     // console.log('test:'+user);
        if (user!=null) {
                // authentication successful
                
                res.send(user);
            } else {
                // authentication failed                
                 return res.send(JSON.stringify({ status: 401, msg: 'The email/password didn\'t match with our records.' }));
            }
    });
}

function register(req, res) {
    userService.create(req.body,function(err,result) {
      //res.send(result);
           if (result) {
                //authentication successful
              // console.log('back to controller:'+user);
                res.send(JSON.stringify({ status: 200, msg: '',result:result }));
                
              // res.send(result);
            } else {
                // authentication failed
                //res.status(400).send('Username or password is incorrect.');
                return res.send(JSON.stringify({ status: 401, msg: 'Error' }));
            }
    });
}

function getUsersList(req, res) {
    if(req.get('authentication')!=null)
        {
           return new Promise((resolve, reject) => {
            let auth = new Auth();
            auth.validateToken(jwtToken, function(err, result){
                if(err) 
                reject(err);
                userService.getUsersList()
                    .then(function (users) {
                        res.send(users);
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });
                });
            })
        }
}
