var router = require('express').Router();
var jwt = require('jsonwebtoken');

var Note = require('../model/NoteModel.js');
var User = require('../model/UserModelPassport.js')
router.post('/create',function(req, res) {

console.log(req.user.id);

  var new_note = new Note();
  new_note.title = req.body.title;
  new_note.note = req.body.note;
  new_note.email = req.body.email;
  new_note.user_id =(req.user.id);
  new_note.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
});
exports.display_a_note = function(req, res) {
  Note.find({
    email: req.body.email
  }, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
// note read
exports.read_a_note = function(req, res) {
  Note.findById(req.params.noteId, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
// note edit or update
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

exports.authme = function(req, res) {
  console.log(req.body);
}
// set a reminder
exports.set_a_reminder = function(req, res) {
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
// note delete or moved to trash
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
// note display all
router.post('/read',function(req, res) {
  console.log('read'+req.user.id);

    //user_id:req.user.id
    Note.find({
    //  email: req.body.email
    user_id:req.user.id,email: req.body.email
    }, function(err, note) {
      if (err)
        res.send(err);

      res.json(note);
    });
});

module.exports = router;
