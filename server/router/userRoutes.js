var router = require('express').Router();
var userController = require('../controller/userController');
var passport = require("../config/passport")(require('passport'));

//route signup with local-passport strategy
router.post('/signup', passport.authenticate('local-signup', {
  session: false
}), userController.signup);

// route login with local-passport strategy
router.post('/login', passport.authenticate('local-login', {
  session: false
}), userController.login);

// authenticate middleware
router.get('/authenticate', userController.authenticate);

//route  forgot password
router.post('/forgotPassword', userController.forgotPassword);

// route reset password
router.post('/resetPassword', userController.resetPassword);

// route for facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
  session: false
}), userController.authenticateFB);

// Google login route
router.get('/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  }));
// route to get google callback
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,  failureRedirect: '/'
  }), userController.authenticateGoogle);

router.get('/profile', function(req, res) {
  //res.json(req);
  console.log(req);
})

module.exports = router;
