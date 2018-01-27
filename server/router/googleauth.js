User = mongoose.model('Users');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy( {
   clientID:'920690214427-ruo8tp6479ksl0f7sqb53ro6fg11e477.apps.googleusercontent.com',
    clientSecret:'XK-NrKR5AtYUKtNf4kO4n0Xr',
    callbackURL:'/auth/google'
  },
  function(accessToken,refreshToken,profile,cb) {
    User.findOrCreate({googdleId:profile.id}, function(err,user) {
      return cb(err,user);
    })
  }
));
