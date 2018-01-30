var router = require('express').Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../model/UserModelPassport.js');
var todoApp = require('../controller/todoController');

//local signup
router.post('/signup',passport.authenticate('local-signup',{
session:false
}),function(req,res) {
  if(typeof(req.body) == 'object') {
    res.status(200).send({
      authenticate: true,
      message: 'Register success',
    });
  } else {
    res.status(401).send({
      authenticate: true,
      message: 'Register Not success',
    });
  }
})
// local login
router.post('/login',passport.authenticate('local-login',{
session:false
}),function(req,res) {
  if(typeof(req.body) == 'object') {
    User.findOne({
      'local.email': req.body.email
    }, function(err, user) {
      console.log(user);
      var token = jwt.sign({
        id: user._id,password:user.local.password
      }, 'secret', {
        expiresIn: 43200 // expires in 12 hours
      });
      res.status(200).send({
        authenticate: true,
        token: token,
        message: 'login success',
        email:req.body.email
      });
  })
} else {
  return res.json({
    authenticate: false,
    token: null,
    message: 'login unsuccess'
  });
}
})

// authenticate middleware

router.get('/authenticate',function(req,res) {
  var  token = req.headers['x-access-token'];
  token = token.replace('Bearer ', '')
  if (!token) return res.status(401).send({
    authenticate: false,
    message: 'No token provided.'
  });
  try {
    jwt.verify(token, 'secret', function(err, decoded) {
      if (err) return res.status(500).send({
        authenticate: false,
        message: 'Failed to authenticate token.'
      });
      User.findById(decoded.id, {
          'local.password': 0
        }, // projection,
        function(err, user) {
          if (err) return res.status(500).send("There was a problem finding the user.");
          if (!user) return res.status(404).send("No user found.");

          res.json(user);
        });
    });
  } catch (e) {
    res.json({
      authenticate: false,
      message: 'system error'
    });

  }
})


module.exports = router;
