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
var session = require('express-session');
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
var authRoutes = require('./server/router/userRoutes.js');
var noteRoutes = require('./server/router/noteRoutes.js');
var expressJwt = require('express-jwt');
var cors = require('cors')

const redis = require('redis');
//const cache = redis.createClient(process.env.PORT);


var cache = new redis.createClient( process.env.PORT);


cache.get('Key',function(err,value) {
  console.log(value);
});


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
app.use(cors());

/*****************************
* Routes for todoApp
*****************************/

/*******************************
* auth routes for user
*******************************/
app.use('/auth',authRoutes);
/*******************************
* note routes for user notes
*******************************/
app.use('/note',expressJwt({secret:'secret'}),noteRoutes);
// if any not found url send url not found
app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

// running serverport
app.listen(port);
console.log("Rest api started on :" + port);
module.exports = app;
