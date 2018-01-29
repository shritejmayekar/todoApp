/**
 *
 *@author Shritej Mayekar
 *@version 1.0
 *@Since 09-1-2018
 *
 **/
// dependencies to server
require('./server/config');
var express = require('express');
//var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var Task = require('./server/model');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var logger = require('./server/logger/logger');
var config = require("./config.json");
const winston = require('winston');
const fs = require('fs');
var User = require('./server/model/UserSocialModel.js');
var passport = require('./server/socialLogin/authentictaion.js');

// mongoose connect to database
mongoose.connect('mongodb://localhost/passport-login',{
  useMongoClient:true
})

// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser:'+user._id);
  done(null,user._id)
});
passport.deserializeUser(function(_id, done) {
  User.findById(_id,function(err,user) {
    console.log(user);
    if(!err) done(null,user);
    else {
      done(err,null)
    }
  })
});


// winston logger to keep logs
logger.debug('overiding express logger');
app.use(morgan('tiny',{ "stream": logger.stream }));
/*app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}));
*/

// configurations
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
/*app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: true
}));
*/
// passport initialize
app.use(passport.initialize());
//app.use(passport.session());
app.use(bodyParser.json());

// Routes for todoApp
require('./server/router/todoRoute.js')(app);
app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

// running serverport
app.listen(port);
console.log("Rest api started on :" + port);
module.exports = app;
