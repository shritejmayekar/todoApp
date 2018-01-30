/**
 *
 *@author Shritej Mayekar
 *@version 1.0
 *@Since 09-1-2018
 *
 **/
// dependencies to server
var dbConfig = require('./server/config');
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
//var passport = require('./server/socialLogin/authentictaion.js');
var passport = require('passport');
var authRoutes = require('./server/router/routes.js');
var noteRoutes = require('./server/router/routeNote.js');
var expressJwt = require('express-jwt');

// mongoose connect to database
//mongoose.connect('mongodb://localhost/passport-login',{
//  useMongoClient:true
//})




// winston logger to keep logs
logger.debug('overiding express logger');
//app.use(morgan('tiny',{ "stream": logger.stream }));
app.use(morgan('dev'));

// configurations
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());
app.use(bodyParser.json());
require('./server/config/passport')(passport);
// Routes for todoApp
//require('./server/router/todoRoute.js')(app);
app.use('/auth',authRoutes);
app.use('/note',expressJwt({secret:'secret'}),noteRoutes);

app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

// running serverport
app.listen(port);
console.log("Rest api started on :" + port);
module.exports = app;
