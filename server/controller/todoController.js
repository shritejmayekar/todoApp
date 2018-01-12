var mongoose = require('mongoose');

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
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
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
    email: req.body.email,
    password: req.body.password
  }, function(err, user) {
    if (err)
      res.send(err);
    if (user == null) {
      res.json({
        status: 'false',
        messsage: 'login unsuccessfull',
        data: 'please check login details'
      });
    } else {
      req.session.name = user.email;
      res.json({
        status: 'true',
        messsage: 'login successfull',
        data: user.name
      });
    }

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
    if (err) {
      console.log(err);
    } else {
      res.json({
        message: 'logout successfull'

      });
    }
  });
};
exports.create_a_note = function(req,res) {
  var new_note = new Note(req.body);
  new_note.save(function(err,user) {
    if(err)
      res.send(err);
    res.json(user);
  });
};
exports.display_a_note = function(req,res) {
Note.find({},function(err,note) {
  if(err)
    res.send(err);
  res.json(note);
});
};
exports.read_a_note = function(req,res) {
  Note.findById(req.params.noteId, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
exports.update_a_note = function(req,res) {
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
  }, function(err,note) {
    if (err)
      res.send(err);
    res.json({
      message: 'Note successfully deleted'
    });
  });
};
exports.note_all_title = function(req,res) {
  Note.find({}, function(err,note) {
    if(err)
      res.send(err);

    res.json(note);
  });
};
