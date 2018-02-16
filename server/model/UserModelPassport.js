var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  local: {
    name:String,
    email: String,
    password: String,
    reset_password_token:String,
    reset_password_expires:String,
    profile: {
      data: Buffer,
    },
    recovery_email:String,
    is_activated:{
      type:Boolean,
      default:false
    }

  },

  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});
// generateHash password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// verify Password
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create model and exported for user
var UserDataModel = mongoose.model('UserData', userSchema);

module.exports = UserDataModel;
