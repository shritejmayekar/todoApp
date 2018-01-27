//ouath 2 social login

// dependencies
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./oauth.js');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = mongoose.model('UserSocial');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../model/UserSocialModel.js');

// config for facebook
module.exports = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({
      OauthID: profile.id
    }, function(err, user) {
      if (err) {
        console.log(err);
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          OauthID: profile.id,
          name: profile.displayName,
          created: Date.now()
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('saving user ....');
            done(null, user);
          }
        })
      }
    })
  }
));
// config for an google
module.exports = passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({
      OauthID: profile.id
    }, function(err, user) {

      if (err) {
        console.log(err);
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          OauthID: profile.id,
          name: profile.email,
          created: Date.now()
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('saving user ....');
            done(null, user);
          }
        })
      }
    })
  }
));
