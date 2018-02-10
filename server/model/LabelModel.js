var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var labelSchema = new Schema({

  user_id:{
    type: String,
    ref: 'UserData'
  },
  label:{
    type:String,

  },
  note_id: [{
    type:String,
      ref:'Notes'
  }]
})
var labelModel = mongoose.model('labels',labelSchema);
module.exports = labelModel;
