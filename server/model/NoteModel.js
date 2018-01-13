var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NoteSchema = new Schema({
  title: {
    type: String,
    required: 'enter title',
    unique: true
  },
  note: {
    type: String,
    required: 'enter note'
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
  label: {
    type: String,
    default: null
  },
  remainder: {
    type: Date,
    default: null
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  collaborator:{
    type:String
  }
});
var NoteModel = mongoose.model('Notes', NoteSchema);
module.exports = NoteModel;
