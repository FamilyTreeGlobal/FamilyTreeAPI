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
    
    userService.authenticate(req.body.username, req.body.password,function(err,user) {
      //res.send(result);
      console.log('test:'+user);
       if (user) {
                // authentication successful
                console.log('inside')
                res.send(user);
            } else {
                // authentication failed
                //res.send('Username or password is incorrect');
                 return res.send(JSON.stringify({ status: 401, msg: 'Username or password is incorrect' }));
            }
    });
}

function register(req, res) {
    userService.create(req.body,function(err,result) {
      //res.send(result);
           if (result) {
                //authentication successful
              // console.log('back to controller:'+user);
               if(result==1){
                    res.send(JSON.stringify({ status: 200, msg: 'email is not available.',result:result }));}
               else if(result==2){
                   res.send(JSON.stringify({ status: 200, msg: 'User created succesfully.',result:result }));
               }else{
                   res.send(JSON.stringify({ status: 200, msg: 'User created succesfully.',result:result }));
               }
                
                
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
