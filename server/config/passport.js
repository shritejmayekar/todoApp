// dependencies
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../model/UserModelPassport.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config/keys.js')
/**********************************************
 * Local passport strategy for login and signup
 ***********************************************/
module.exports = function(passport) {
  // serialize and deserialize
  passport.serializeUser(function(user, done) {
    console.log('serializeUser:' + user._id);
    done(null, user._id)
  });
  passport.deserializeUser(function(_id, done) {
    User.findById(_id, function(err, user) {
      console.log(user);
      if (!err) done(null, user);
      else {
        done(err, null)
      }
    })
  });
  // passport local signup strategy
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      process.nextTick(function() {
        User.findOne({
          'local.email': email
        }, function(err, user) {
          if (err) return done(err)
          // if user already exist
          if (user) {
            return done(null, false)
          } else {
            // create new user
            var newUser = new User();
            // set creadiantial
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            // save new user
            newUser.save(function(err) {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });

      });
    }
  ))
  // passport local login strategy
  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      User.findOne({
        'local.email': email
      }, function(err, user) {
        // if error occurs
        if (err) return done(err);
        // if user not found
        if (!user) return done(null, false, {
          message: 'user not found'
        });
        // if user password is in valid
        if (!user.validPassword(password)) return done(null, false, {
          message: 'user password invlaid'
        });
        // true user
        return done(null, user);
      })
    }
  ))
  /********************************************
   * passport facebook token startegy
   ********************************************/
  // config for facebook
  passport.use('facebook', new FacebookStrategy({
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('In the passport watch');
      console.log(accessToken + '\n' + refreshToken + '\n');
      console.log(profile);
      process.nextTick(function(res) {
        User.findOne({
          'facebook.id': profile.id
        }, function(err, user) {
          if (err) return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();

            newUser.facebook.id = profile.id;
            newUser.facebook.token = accessToken;
            newUser.facebook.name = profile.displayName;
            newUser.save(function(err) {
              if (err) throw err;
              return done(null, newUser);
            })
          }
        })
      })
      //  done(null,profile);
    }
  ));


  /***************************************************
   * passport google token startegy
   ***************************************************/
  passport.use('google', new GoogleStrategy({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
      passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
      console.log(accessToken + '\n' + refreshToken)
      console.log(profile);
      process.nextTick(function(res) {
        User.findOne({
          'google.id': profile.id
        }, function(err, user) {
          if (err) return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();

            newUser.google.id = profile.id;
            newUser.google.token = accessToken;
            newUser.google.email = profile.email;
            newUser.save(function(err) {
              if (err) throw err;
              return done(null, newUser);
            })
          }
        })
      })
    }
  ));
  return passport;
};
