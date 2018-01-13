var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
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
    password: hashedPassword
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
      token: token
    });
  });
};


exports.get_token = function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({
    authenticate: false,
    message: 'No token provided.'
  });

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
      token: null
    });
    req.session.name = user.email;
    var token = jwt.sign({
      id: user._id
    }, 'secret', {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({
      authenticate: true,
      token: token
    });
  });

};

exports.update_a_user = function(req, res) {
  User.findOneAndUpdate({
    _id: req.params.userId
  }, req.body, {
    new: true
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
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
  Note.find({}, function(err, note) {
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
  Note.find({}, function(err, note) {
    if (err)
      res.send(err);

    res.json(note);
  });
};
//read card note
