var router = require('express').Router();
var userController = require('../controller/userController');
var passport = require("../config/passport")(require('passport'));

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
  res.json(req.user)
}

)
router.get('/profile',function(req,res) {
  res.json(req.user);
})


module.exports = router;
