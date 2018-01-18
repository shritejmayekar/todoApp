var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var logger = require('../logger/logger.js');
var nodemailer = require('nodemailer');
//var config = require('../config');
User = mongoose.model('Users');
Note = mongoose.model('Notes');


exports.list_of_user = function(req, res) {

  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.register_a_user = function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var protectedInfo = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    recoveryEmail: req.body.recoveryEmail
  };
  var new_user = new User(protectedInfo);
  new_user.save(function(err, user) {
    if (err) return res.send("There was a problem registering the user.");
    // create a token
    var token = jwt.sign({
      id: user._id
    }, 'secret', {
      expiresIn: 86400 // expires in 24 hours
    });
    res.json({
      authenticate: true,
      token: token,
      message: 'Register success'
    });
  });
};


exports.get_token = function(req, res) {
  console.log(req);
  var token = req.headers['x-access-token'];

  if (!token) return res.status(401).send({
    authenticate: false,
    message: 'No token provided.'
  });
  try {


    jwt.verify(token, 'secret', function(err, decoded) {
      if (err) return res.status(500).send({
        authenticate: false,
        message: 'Failed to authenticate token.'
      });

      //res.json(decoded);
      User.findById(decoded.id, {
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
};
exports.get_token_auth = function(req, res) {

  var token = req.body.token;
  var oldDate = req.body.date;
  var now = new Date();
  if (!token) return res.status(401).send({
    authenticate: false,
    message: 'No token provided.'
  });
  try {


    jwt.verify(token, 'secret', function(err, decoded) {
      if (err) return res.status(500).send({
        authenticate: false,
        message: 'Failed to authenticate token.'
      });

      //res.json(decoded);
      User.findById(decoded.id, {
          password: 0
        }, // projection,
        function(err, user) {
          if (err) return res.status(500).send("There was a problem finding the user.");
          if (!user) return res.status(404).send("No user found.");

          res.json({
            authenticate: true,
            message: 'authenticated token.'
          });
        });
    });
  } catch (e) {
    logger.info('System error ' + e);
    console.log(e);
  }
};


exports.read_a_user = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.login_a_user = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) return res.send('Error on the server');
    if (user == null) return res.status(401).send({
      authenticate: false,
      token: null
    });
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.json({
      authenticate: false,
      token: null,
      message: 'login unsuccess'
    });
    req.session.name = user.email;
    var token = jwt.sign({
      id: user._id
    }, 'secret', {
      expiresIn: 86400 // expires in 24 hours
    });
    User.findOneAndUpdate({email:req.body.email},{token:token},{new:true});
    console.log(token);
    res.status(200).send({
      authenticate: true,
      token: token,
      message: 'login success'
    });
  });

};

exports.update_a_user = function(req, res) {
  var getParameters = req.body;
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  getParameters.password = hashedPassword;
  var oldToken = getParameters.token;
  var decoded = jwt.verify(oldToken, 'secret');
  //  jwt.verify({oldToken},'secret',{expiresIn:1});
  User.findOneAndUpdate({
    _id: req.params.userId
  }, getParameters, {
    new: true
  }, function(err, user) {
    if (err)
      res.send(err);
    var token = jwt.sign({
      id: user._id
    }, 'secret', {
      expiresIn: 86400 // expires in 24 hours
    });

    console.log(decoded);
    res.json({
      status: 'authenticated',
      token: token,
      message: 'updated user details',
      user: user
    });
  });
};


exports.delete_a_user = function(req, res) {
  User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json({
      message: 'User successfully deleted'
    });
  });
};
exports.logout_a_user = function(req, res) {
  req.session.destroy(function(err) {
    if (err) return res.send(err);

    res.json({
      authenticate: false,
      token: null
    });

  });
};
exports.create_a_note = function(req, res) {
  var new_note = new Note(req.body);
  new_note.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};
exports.display_a_note = function(req, res) {
  Note.find({email:req.body.email}, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
exports.read_a_note = function(req, res) {
  Note.findById(req.params.noteId, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
exports.update_a_note = function(req, res) {
  Note.findOneAndUpdate({
    _id: req.params.noteId
  }, req.body, {
    new: true
  }, function(err, note) {
    if (err)
      res.send(err);

    res.json(note);
  });
};

exports.delete_a_note = function(req, res) {
  Note.remove({
    _id: req.params.noteId
  }, function(err, note) {
    if (err)
      res.send(err);
    res.json({
      message: 'Note successfully deleted'
    });
  });
};
exports.note_all_title = function(req, res) {
  Note.find({email:req.body.email}, function(err, note) {
    if (err)
      res.send(err);

    res.json(note);
  });
};

exports.forgot_password = function(req, res) {

  User.findOne({
      email: req.body.email
    },
    function(err, user) {
      if (err) return res.send('Error on the server');
      if (user == null) return res.status(401).send({
        authenticate: false,
        token: null
      });


      var token = jwt.sign({
        id: user._id
      }, 'secret', {
        expiresIn: 86400 // expires in 24 hours
      });
      User.findByIdAndUpdate({
        _id: user._id
      }, {
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000
      }, {
        upsert: true,
        new: true
      }).exec(function(err, new_user) {





        var transporter = nodemailer.createTransport({

          service: 'gmail',
          auth: {
            user: 'shritejmayekar69@gmail.com',
            pass: 'fuck8793895204'
          }
        });

        var mailOptions = {
          from: 'shritejmayekar69@gmail.com',
          to: new_user.email,
          subject: 'Password recovery',
          text: 'The help for password has arrived',
          html: '<a href='+'http://localhost:3000/auth/reset_password?token='+ token+' >click</a>'

        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) return res.send(error);
          res.json({
            status: info.response,
            messages: 'message send to email',
            context: {
              url: 'http://localhost:3000/auth/reset_password?token=' + token

            }
          })
        });
      })
    })
}
exports.reset_password = function(req, res, next) {
 var get_token_url = req.query.token;

User.findOne({
 reset_password_token: get_token_url,
 reset_password_expires: {
   $gt: Date.now()
 }
}).exec(function(err, user) {
//res.json(user);
 if (!err && user) {
   if (req.body.newPassword === req.body.verifyPassword) {
     user.password= bcrypt.hashSync(req.body.newPassword, 8);
     user.reset_password_token = undefined;
     user.reset_password_expires = undefined;
     user.save(function(err) {
       if (err) {
         return res.status(422).send({
           message: err
         });
       } else {
         var transporter = nodemailer.createTransport({

           service: 'gmail',
           auth: {
             user: 'shritejmayekar69@gmail.com',
             pass: 'fuck8793895204'
           }
         });
         var data = {
           to: user.email,
           from: 'shritejmayekar69@gmail.com',
           subject: 'Password Reset Confirmation',
           text:'Password reset succes you can Login with new Password',
           context: {
             name: user.email
           }
         };

        transporter.sendMail(data, function(err) {
           if (!err) {
             return res.json({ message: 'Password reset' });
           } else {
             return done(err);
           }
         });
       }
     });
   } else {
     return res.status(422).send({
       message: 'Passwords do not match'
     });
   }
 } else {
   return res.status(400).send({
     message: 'Password reset token is invalid or has expired.',
     msg:req.body.token
   });
 }
});

}
//read card note
exports.reset_get = function(req,res)  {
  console.log(req.url);
}
