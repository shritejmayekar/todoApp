// schema for socialLogin users

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserSocialSchema = new Schema({
  OauthID: String,
  name: String,
  created: Date
})
var UserSocialModel = mongoose.model('UserSocial', UserSocialSchema);

module.exports = UserSocialModel;
