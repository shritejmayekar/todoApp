// dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// note schema for note in todoApp
var NoteSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: String,
    ref: 'UserData'
  },
  title: {
    type: String,
    required: 'enter title',
    //  unique: true
  },
  note: {
    type: String,
    required: 'enter note'
  },
  email: {
    type: String,
    required: 'true'
  },
  is_pinned: {
    type: Boolean,
    default: false
  },
  is_archieved: {
    type: Boolean,
    default: false
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  label: [{
    type: String
  }],
  reminder: {
    type: Date,
    default: null
  },

  collaborator: [{
    type: String
  }],
  shared_id:[{
    type:String
  }],
  edited: {
    type: Date,
    default: Date.now()
  },
  note_color: {
    type: String
  },
  picture:{
    data:Buffer,
  },
  is_labeled:{
    type:Boolean,
    default:false
  }
});

var NoteModel = mongoose.model('Notes', NoteSchema);
module.exports = NoteModel;
