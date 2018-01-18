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
  reset_password_token:{
    type:String
  },
  reset_password_expires:{
    type:String
  },
  password: {
    type: String,
    required: 'enter password'
  },
  recoveryEmail: {
    type:String,
  //  required:true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {

    type: Boolean
  },
  token :{
    type:String
  }
});

var UserModel = mongoose.model('Users',UserSchema);
module.exports = UserModel;
