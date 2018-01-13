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

var UserModel = mongoose.model('Users',UserSchema);
module.exports = UserModel;
