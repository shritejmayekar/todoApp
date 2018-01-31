// dependencies
var jwt = require('jsonwebtoken');
var Note = require('../model/NoteModel.js');
var User = require('../model/UserModelPassport.js')
/******************************
* CRUD operation of Notes
******************************/


// create note function for note creation of user
exports.create = function(req, res) {
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
}
// readNote function to read specific user all notes
exports.readNote = function(req, res) {
    Note.find({
    // find by id and email
    user_id:req.user.id
    }, function(err, note) {
      if (err)
        res.send(err);

      res.json(note);
    });
}
// update function to update a current note
exports.update = function(req, res) {
  Note.findOneAndUpdate({
    _id: req.params.noteId,
    user_id:req.user.id
  }, req.body, {
    new: true
  }, function(err, note) {
    if (err)
      res.send(err);

    res.json(note);
  });
};
// delete function to delete notes of specific user
exports.delete = function(req, res) {
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
