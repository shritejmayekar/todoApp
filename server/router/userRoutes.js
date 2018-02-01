var router = require('express').Router();
var userController = require('../controller/userController');
var passport = require("../config/passport")(require('passport'));
var jwt = require('jsonwebtoken');
var User = require('../model/UserModelPassport.js');

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
router.get('/facebook',passport.authenticate('facebook',{scope:'email'}));

router.get('/facebook/callback',passport.authenticate('facebook',{
  session: false,
  failureRedirect:'/#!/login',
}),function(req,res) {
//res.json(req.user)
  console.log('user',req.user._id);
var token = jwt.sign({id:req.user._id},'secret',{expiresIn:'6000'});
res.json(token);
//next();
  //res.redirect('/')
});


var sendToken = function (req, res,next) {
  res.setHeader('x-access-token', req.token);
  res.status(200).send(req.auth);
};
var getCurrentUser = function(req, res, next) {
  User.findById(req.auth.id, function(err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

var getOne = function (req, res) {
  var user = req.user.toObject();

  delete user['facebookProvider'];
  delete user['__v'];

  res.json(user);
};

router.get('/me', getCurrentUser, getOne);

router.get('/profile',function(req,res) {
  res.json(req.user);
})


module.exports = router;
