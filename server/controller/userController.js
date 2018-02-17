  // dependencies
  var jwt = require('jsonwebtoken');
  var User = require('../model/UserModelPassport.js');
  var keys = require('../config/keys.js');
  var config = require('../config/config');
  var nodemailer = require('nodemailer');
  var userService = require('../service/userService.js');
  var redis = require('redis');
  var cache = new redis.createClient(process.env.PORT);
  var RedisSMQ = new require('rsmq');
  var rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );
  /****************************************
  * CREATE Message Queue
  ***************************************/

  rsmq.createQueue({qname:'redisActiveUserSMQ'},function(err,resp){
      if(resp == 1) {
        console.log('Queue created');
      }
  })

  /******************************
   * Login and signup
   ******************************/
  // sigup function for register user in db
  exports.signup = function(req, res) {
    if (typeof(req.body) == 'object') {
      rsmq.sendMessage({qname:'redisActiveUserSMQ',message:req.body.email+' Activated'}, function(err,resp) {
          if(resp) {
            console.log('Message sent:'+resp);
            mailSend(req.body.email);
          }
      })
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
      User.findOneUser(req.body.email).then(function(user) {
        if(!user) res.status(401).json('user not found');
        var token = jwt.sign({
          id: user._id, // payload
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
  var token = req.headers['x-access-token']
    //var token =  req.headers['Authorization'];
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
  /******************************************
  * Activate the user Account after Register
  ****************************************/
  exports.activateUser = function(req,res) {
    var email = req.params.data;
    var userToken = req.params.token;

    cache.get(email,function(err,token) {

      if(err) return res.json({message:'No valid token'})
      if(!token) return       res.redirect('/#!/register');

      //res.json({message:'No token provided'})
       var data = {
         'local.is_activated':true
       }
       cache.del(email);
      User.findOneAndUpdate({'local.email':email},data,{new:true},function(err,user) {
        console.log(user);
         res.redirect('/');
        //  res.json({token:token,Message:'User is Activated'})

      })

    })
      //res.redirect('/#!/register');
  }
  exports.authenticateFB = function(req, res) {
    //res.json(req.user)
    console.log('user', req.user._id);
    var token = jwt.sign({
      id: req.user._id
    }, 'secret', {
      expiresIn: '86400'
    });
    res.redirect('/#!/dummyPage/' + token);
  }
  exports.authenticateGoogle = function(req, res) {
    console.log('user', req.user._id);
    var token = jwt.sign({
      id: req.user._id
    }, 'secret', {
      expiresIn: '86400'
    });
    res.redirect('/#!/dummyPage/' + token);

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
          cache.set(new_user.local.email,token);
          cache.expire(new_user.local.email, 3600);
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
              'kindly use this <a href=' + config.baseUrl+'/#!/resetPassword?token=' + token + ' >link</a>' +
              ' to reset your password</p>'

          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) return res.send(error);
            res.json({
              status: info.response,
              messages: 'message send to email',
              context: {
                url: config.baseUrl+'/auth/resetPassword?token=' + token
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
          user.local.password = user.generateHash(req.body.newPassword);
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

  exports.profilePic = function(req, res) {
    var token = req.headers['x-access-token']
    //var token =  req.headers['Authorization'];
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
        User.findOneAndUpdate({
            _id: decoded.id
          }, req.body, {
            new: true,
            password: 0
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

  var mailSend = function(user) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: keys.emailKey,
        pass: keys.passwordKey
      }
    });

    var token = jwt.sign({
      email: user
    }, 'secret', {
      expiresIn: 86400 // expires in 24 hours
    });
    cache.del(user);
    cache.set(user,token);
    var mailOptions = {
      from: keys.emailKey,
      to: user,
      subject: 'Authenticated User',
      text: 'Register to todoApp Success',
      html: '<h3>Dear ' + user + ',</h3>' + '<p>Your Registered successfully, ' +
        'kindly use this <a href=' + config.baseUrl+'/auth/activateUser/' +user+'/'+ token + ' >link</a>' +
        ' to Activate the Account</p>'

    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) return res.send(error);
      rsmq.receiveMessage({qname:'redisActiveUserSMQ'}, function(err,resp) {
        if(resp.id) {
          console.log('Message Received:' +resp);
          rsmq.deleteMessage({qname:'redisActiveUserSMQ',id:resp.id},function(err,resp) {
            if(resp == 1) {
              console.log('Message sent');
            }
            else {
              console.log("Message not Found");
            }
          })
        }
        else {
          console.log('No message for me');
        }
      })
      res.json({
        status: info.response,
        messages: 'message send to email',
        context: {
          url: config.baseUrl+'/auth/activateUser/' + user+'/'+token
        }
      })
    });
  }
