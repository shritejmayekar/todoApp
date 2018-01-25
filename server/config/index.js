var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todoDB', {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
