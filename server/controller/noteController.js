// dependencies
var jwt = require('jsonwebtoken');
var Note = require('../model/NoteModel.js');
var User = require('../model/UserModelPassport.js')
const redis = require('redis');
var Collab =require('../model/CollaboratorModel.js');
var cache = new redis.createClient( process.env.PORT);

//cache.get('Key',function(err,value) {
  //console.log(value);
//});
/*
var events = require('events');
var eventEmitter = new events.EventEmitter();
var myEventHandler =function() {
  console.log('listening');
}
eventEmitter.on('passwordReset', myEventHandler);*/
/******************************
* CRUD operation of Notes
******************************/


// create note function for note creation of user
exports.create = function(req, res) {
  var new_note = new Note();
  var collab = new Collab();
  new_note.title = req.body.title;
  new_note.note = req.body.note;
  new_note.email = req.body.email;
  new_note.user_id =(req.user.id);
  new_note.collaborator.push(req.body.email+' (Owner)');
  new_note.save(function(err, user) {
    if (err)
      res.send(err);
      console.log(user);
    collab.user_id = (req.user.id);
    collab.note_id = user._id;
    collab.collaborator_id = req.user.id;
    collab.save(function(err,collabs) {
      console.log(collabs);
    })
    res.json(user);
  });
}
// readNote function to read specific user all notes
exports.readNote = function(req, res) {
    cache.get(req.user.id,function(err,note) {
    //  console.log('cache'+note);
      //  res.json(JSON.parse(note));
    })
    Note.find({
    // find by id and email
    user_id:req.user.id
    }, function(err, note) {
      if (err)
        res.send(err);
      //  cache.set(req.user.id,3600,note);
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
// reminder controller to reminde
exports.reminder = function(req,res) {
  Note.findOne({user_id:req.user.id},function(err,res) {
    res.json('');
  } )
}
// update function to update a current note
exports.collab = function(req, res) {
  console.log(req.body.email);
  User.findOne({'local.email':req.body.email},{'local.password':0,'local.profile':0},function(err,user) {
console.log(user);
try {
  if(err) res.send(err)
  if(!user) res.json('user not found');

  var data  = {
    collaborators_id:user._id
  }
  var dataColab = {
    collaborator:req.body.email
  }
  Note.findOneAndUpdate({
    _id: req.params.noteId,
  },{$push:dataColab},{new:true}, function(err, note) {
    if (err)
      res.send(err);
      Collab.findOneAndUpdate({ note_id:req.params.noteId},{$push:data},{new:true},
        function(err,res) {
          console.log(res);
      })
    res.json(note);
  });

} catch (e) {

}

  })
};

exports.collabsNote = function(req,res) {
User.findOne({'local.email':req.body.email}, function(err,user) {
  console.log(user);
    Collab.findOne({collaborators_id:user._id},{'local._id':0,'local.password':0,'collaborators_id':0},function(err,user) {
      console.log(user);
   })

})
}
