// dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// note schema for note in todoApp
var NoteSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  //user_id:[{
  //  type:Schema.Types.ObjectId,ref:'UserData'
  //}],
  user_id:{
    type:String,ref:'UserData'
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
  email:{
    type:String,
    required:'true'
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

  collaborator:{
    type:String
  },
  edited:{
    type:Date,
    default: Date.now()
  }
});
var NoteModel = mongoose.model('Notes', NoteSchema);
module.exports = NoteModel;
