var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: 'enter name'
  },
  email: {
    type: String,
    required: 'enter email',
    unique: true
  },
  password: {
    type: String,
    required: 'enter password'
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {

    type: String,
    default: ['created']
  }
});

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
  pinned_note: {
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
  Created_date: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model('Notes', NoteSchema);
module.exports = mongoose.model('Users', UserSchema);
