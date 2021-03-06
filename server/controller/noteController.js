// dependencies
var jwt = require('jsonwebtoken');
var Note = require('../model/NoteModel.js');
var User = require('../model/UserModelPassport.js')
var Label = require('../model/LabelModel.js')
const redis = require('redis');
var Collab =require('../model/CollaboratorModel.js');
var cache = new redis.createClient( process.env.PORT);
/*var events = require('events');
var eventEmitter = new events.EventEmitter();
var myEventHandler =function() {
  console.log('listening');
}
eventEmitter.on('passwordReset', myEventHandler);*/
/******************************
* CRUD operation of Notes
******************************/

/*********************************
* Redis SET/CREATE Notes
**********************************/
var redisSet =  function(user_id,user) {
  cache.get(user_id,function(err,note) {
  var noteCache = [];
  noteCache =JSON.parse(note);
//  console.log("note cache \n"+noteCache);
//  console.log("user cache \n"+ user);
  cache. set(user_id,JSON.stringify(noteCache.concat(user)), redis.print);
  })
}
/*************************************
* Redis SET/UPDATE Notes
*************************************/
var redisSetUp =  function(user_id,user,noteId) {
  cache.get(user_id,function(err,note) {
  var noteCache = [];
  noteCache =JSON.parse(note);
//  console.log("note cache \n"+noteCache);
//  console.log("user cache \n"+ user);
  var pos = -1;
  for (var i = 0; i < noteCache.length; i++) {
    if(noteCache[i]._id == noteId ) {
      noteCache[i] = user;
        break;
    }
  }
  cache. set(user_id,JSON.stringify(noteCache), redis.print);
  })
}
/******************************************
 * Create note function for note
 *    creation of user
 ****************************************/
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
      redisSet(req.user.id,user);
    collab.user_id = (req.user.id);
    collab.note_id = user._id;
    collab.collaborator_id = req.user.id;
    collab.save(function(err,collabs) {
      console.log(collabs);
    })
    res.json(user);
  });
}
/**************************************
* readNote function to read specific user all notes
**************************************/
exports.readNote = function(req, res) {
  var flag = 0;
  cache.exists(req.user.id,function(err,reply) {
    if(err) {
      cache.del(req.user.id,function(err,redisNote) {
        res.redirect('/');
      })
    }
    if(reply == 1) {
      console.log('redis cache exists');
      flag = 1;
      cache.get(req.user.id,function(err,redisNote) {
        res.json(JSON.parse(redisNote));
      })
    } else {
      console.log('redis cache not exists');
      Note.find({
      // find by id and email
      user_id:req.user.id
      }, function(err, note) {
        if (err)
          res.send(err);
            console.log('in model');
              cache.setex(req.user.id,180, JSON.stringify(note), redis.print);
              //cache.expires(180);
        res.json(note);
      });
    }
  })
}

/*****************************************
* update function to update a current note
*****************************************/
exports.update = function(req, res) {
  Note.findOneAndUpdate({
    _id: req.params.noteId,
  //  user_id:req.user.id
  }, req.body, {
    new: true
  }, function(err, note) {
    if (err)
      res.send(err);
    redisSetUp(req.user.id,note,req.params.noteId);
    res.json(note);
  });
};
/*******************************************
* delete function to delete notes of specific user
******************************************/
exports.delete = function(req, res) {
  Note.remove({
    _id: req.params.noteId
  }, function(err, note) {
    if (err)
      res.send(err);
      cache.get(req.user.id,function(err,redisNote) {
      var noteCache = [];
      noteCache =JSON.parse(redisNote);
      console.log("note cache \n"+noteCache);
      console.log("user cache \n"+redisNote);
      var pos = -1;
      for (var i = 0; i < noteCache.length; i++) {
        if(noteCache[i]._id == req.params.noteId ) {
            pos = i;
            break;
        }
      }
	     noteCache.splice(pos, 1);
      console.log(JSON.stringify(noteCache));
      cache. set(req.user.id,JSON.stringify(noteCache), redis.print);
      })
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
/*******************************************
*  update function to update a current note
********************************************/
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
  var sharedNote = {
    shared_id:user._id,
    collaborator:user.local.email
  }

  Note.findOneAndUpdate({
    _id: req.params.noteId,
  },{$push:sharedNote},{new:true}, function(err, note) {
    if (err)
      res.send(err);
      Collab.findOneAndUpdate({ note_id:req.params.noteId},{$push:data},{new:true},
        function(err,res) {
          console.log(res);
      })
      redisSet(req.user.id,note);

    res.json(note);
  });

} catch (e) {

}

  })
};
/***********************************
* Get collaborated notes
************************************/
exports.collaboratedNote = function(req,res) {
console.log(req.user.id);
Note.find({shared_id:{ "$in" : [req.user.id]}},function(err, note) {
  console.log(note);
  res.json(note);
})
}

exports.collaborateRemove = function(req,res) {
  console.log(req);
  User.findById({_id:req.user.id},function(err,user) {

    var sharedNote = {
        shared_id:user._id,
        collaborator:user.local.email
      }
      Note.findOneAndUpdate({
        _id: req.params.noteId,
      //  user_id:req.user.id
    }, {$pull:sharedNote}, {
        new: true
      }, function(err, note) {
        if (err)
          res.send(err);
          console.log(note);
        res.json(note);
      });
  })
}
/*****************************************
* addLabel function Add label to the notes
*****************************************/
exports.addLabel = function(req, res) {
  var new_label = new Label();
//  console.log(req.body.answer);
  new_label.user_id =(req.user.id);
  new_label.note_id = (req.user.note_id);
  new_label.label   = (req.body.answer);
  new_label.save(function(err, user) {
    if (err)
      res.send(err);
      redisSet(req.user.id,user);
    res.json(user);
  });
}
/******************************************
* removeLabel function Remove label from notes
******************************************/
exports.removeLabel = function(req, res) {
    console.log(req.params.label+'\n'+req.user.id);
  Label.remove({
    user_id:req.user.id,
    label:req.params.label
  }, function(err, note) {
    if (err)
      res.send(err);
      if(!note) return res.send('not found');
    res.json({
      message: 'Label successfully deleted'
    });
  });
}
/******************************************
* getLabel function display user labels
******************************************/
exports.getLabel = function(req, res) {
  Label.find({
  // find by id and email
  user_id:req.user.id
  }, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
}
