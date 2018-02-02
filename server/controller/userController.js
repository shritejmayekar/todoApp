// dependencies
var jwt = require('jsonwebtoken');
var User = require('../model/UserModelPassport.js');
var keys = require('../config/keys.js');
var nodemailer = require('nodemailer');

/******************************
 * Login and signup
 ******************************/
// sigup function for register user in db
exports.signup = function(req, res) {
  if (typeof(req.body) == 'object') {
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
};
// login function to find user in db
exports.login = function(req, res) {
  if (typeof(req.body) == 'object') {
    User.findOne({
      'local.email': req.body.email
    }, function(err, user) {
      console.log(user);

      var token = jwt.sign({
        id: user._id,                       // payload
        password: user.local.password
      }, 'secret', {
        expiresIn: 43200 // expires in 12 hours
      });
      res.status(200).send({
        authenticate: true,
        token: token,
        message: 'login success',
        email: req.body.email
      });
    })
  } else {
    return res.json({
      authenticate: false,
      token: null,
      message: 'login unsuccess'
    });
  }
}
// authenticate user by using token
exports.authenticate = function(req, res) {
  var token = req.headers['x-access-token'];
  token = token.replace('Bearer ', '')
  if (!token) return res.status(401).send({
    authenticate: false,
    message: 'No token provided.'
  });
  try {
    // generating jwt token
    jwt.verify(token, 'secret', function(err, decoded) {
      if (err) return res.status(500).send({
        authenticate: false,
        message: 'Failed to authenticate token.'
      });
      // decoded user
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
}


/******************************
 * Password reset
 *******************************/

// forgot password

// forgot password
exports.forgotPassword = function(req, res) {

  User.findOne({
      'local.email': req.body.email
    },
    function(err, user) {
      if (err) return res.send('Error on the server');
      if (user == null) return res.status(401).send({
        authenticate: false,
        token: null
      });
      var token = jwt.sign({
        _id: user._id
      }, 'secret', {
        expiresIn: 86400 // expires in 24 hours
      });
      console.log(token);
      User.findByIdAndUpdate({
        _id: user._id
      }, {
        'local.reset_password_token': token,
        'local.reset_password_expires': Date.now() + 86400000
      }, {
        upsert: true,
        new: true
      }).exec(function(err, new_user) {
        console.log(new_user.local.email);
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: keys.emailKey,
            pass: keys.passwordKey
          }
        });
        var mailOptions = {
          from: keys.emailKey,
          to: new_user.local.email,
          subject: 'Password recovery',
          text: 'The help for password has arrived',
          html: '<h3>Dear ' + new_user.local.email + ',</h3>' + '<p>You requested for a password reset, ' +
            'kindly use this <a href=' + 'http://localhost:3000/#!/resetPassword?token=' + token + ' >link</a>' +
            ' to reset your password</p>'

        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) return res.send(error);
          res.json({
            status: info.response,
            messages: 'message send to email',
            context: {
              url: 'http://localhost:3000/auth/resetPassword?token=' + token
            }
          })
        });
      })
    })
}


// reset a password
exports.resetPassword = function(req, res, next) {
  var getToken = req.query.token;

  User.findOne({
    'local.reset_password_token': getToken,
    'local.reset_password_expires': {
      $gt: Date.now()
    }
  }).exec(function(err, user) {
    if (!err && user) {
      if (req.body.newPassword === req.body.verifyPassword) {
        user.local.password=user.generateHash(req.body.newPassword);
        user.local.reset_password_token = undefined;
        user.local.reset_password_expires = undefined;
        user.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {
            var transporter = nodemailer.createTransport({

              service: 'gmail',
              auth: {
                user: keys.emailKey,
                pass: keys.passwordKey
              }
            });
            var data = {
              to: user.local.email,
              from: keys.emailKey,
              subject: 'Password Reset Confirmation',
              text: 'Password reset succes you can Login with new Password',
              context: {
                name: user.local.email
              }
            };

            transporter.sendMail(data, function(err) {
              if (!err) {
                return res.json({
                  message: 'Password reset'
                });
              } else {
                return done(err);
              }
            });
          }
        });
      } else {
        return res.status(422).json({
          message: 'Passwords do not match'
        });
      }
    } else {
      return res.status(400).json({
        message: 'Password reset token is invalid or has expired.',
        msg: req.body.token
      });
    }
  });

}
