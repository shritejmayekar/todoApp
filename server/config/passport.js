var LocalStrategy = require('passport-local').Strategy;

  var User = require('../model/UserModelPassport.js')
module.exports = function(passport) {
  // serialize and deserialize
  passport.serializeUser(function(user, done) {
    console.log('serializeUser:'+user._id);
    done(null,user._id)
  });
  passport.deserializeUser(function(_id, done) {
    User.findById(_id,function(err,user) {
      console.log(user);
      if(!err) done(null,user);
      else {
        done(err,null)
      }
    })
  });


  passport.use('local-signup',new LocalStrategy({

    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
  },
  function(req,email,password,done) {
    process.nextTick(function() {
      User.findOne({'local.email':email} , function(err,user) {
        if(err)  return done(err)
        // if user already exist
        if(user) {
          return done(null,false)
        }
        else {
          // create new user
          var newUser = new User();
          // set creadiantial
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          // save new user
          newUser.save(function(err) {
            if(err) throw err;
            return done(null,newUser);
          });
        }
      });

    });
  }


))
passport.use('local-login',new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
},
  function(req,email,password,done) {
    User.findOne({'local.email':email}, function(err,user) {
      // if error occurs
      if(err) return done(err);
      // if user not found
      if(!user) return done(null,false,{message:'user not found'});
      // if user password is in valid
      if(!user.validPassword(password)) return done(null,false,{message:'user password invlaid'});
      // true user
      return done(null,user);
    })

  }
))


};
