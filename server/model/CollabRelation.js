var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collaboratorSchema = new Schema({

  user_id:[{
    type: String,
    ref: 'UserData'
  }],
  note_id:{
    type:String,
    ref:'Notes'
  },
  collaborators_id: [{
    type:String
  }]
})
var collaboratorModel = mongoose.model('collabs',collaboratorSchema);
module.exports = collaboratorModel;
