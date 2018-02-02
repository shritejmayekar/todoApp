var router = require('express').Router();
var userController = require('../controller/userController');
var passport = require("../config/passport")(require('passport'));
var jwt = require('jsonwebtoken');
var User = require('../model/UserModelPassport.js');
var expressJwt = require('express-jwt');

//route signup with local-passport strategy
router.post('/signup',passport.authenticate('local-signup',{
session:false
}),userController.signup);

// route login with local-passport strategy
router.post('/login',passport.authenticate('local-login',{
session:false
}),userController.login);

// authenticate middleware
router.get('/authenticate',userController.authenticate);

//route  forgot password
router.post('/forgotPassword',userController.forgotPassword);

// route reset password
router.post('/resetPassword',userController.resetPassword);

// route for facebook
//router.get('/facebook',passport.authenticate('facebook',{scope:'email'}));
/*
router.post('/facebook/',passport.authenticate('facebook',{session: false}),
function(req,res,next) {
//res.json(req.user)
  console.log('user',req.user._id);
  req.auth =  {
    id:req.user._id
  }
//res.json(token);
next();
  //res.setHeader('x-access-token','Bearer '+ token);
  //res.redirect('/#!/login/?token='+token);
  //res.redirect('/auth/getToken?token='+token)
},generateToken,sendToken);

var creatToken =  function(auth) {
  return jwt.sign({id:req.user._id},'secret',{expiresIn:'6000'});
}
var generateToken = function(req,res,next) {
  req.token = creatToken(req.token);
  next();
}
var sendToken = function (req, res,next) {
  res.setHeader('x-access-token', req.token);
  res.status(200).send(req.auth);
};
var authenticate = expressJwt( {
  secret:'secret',
  requestProperty:'auth',
  getToken:function(req) {
    if(req.headers['x-access-token']) {
      return req.headers['x-access-token'];
    }
    return null;
  }
})
var getCurrentUser = function(req, res, next) {
  console.log(req);

  User.findById({'facebook.id':req.user._id}, function(err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};
*/
var getOne = function (req, res) {
  var user = req.user.toObject();

  delete user['facebookProvider'];
  delete user['__v'];

  res.json(user);
};
router.get('/getToken',function(req,res) {
  console.log(req.query.token);
  res.json(req.query)
})
var getToken = function(req,res) {
  console.log(req.query.token);
  res.json(req.query)
}
//router.get('/me', authenticate,  getCurrentUser, getOne);

router.get('/profile',function(req,res) {
  res.json(req.user);
})


module.exports = router;
