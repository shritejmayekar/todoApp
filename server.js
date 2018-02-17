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
var http = require('http').createServer(app);
var mongoose = require('mongoose');
var Task = require('./server/model');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var logger = require('./server/logger/logger');
var config = require("./config.json");
const winston = require('winston');
const fs = require('fs');
var io = require('socket.io')(http);
var User = require('./server/model/UserSocialModel.js');
var passport = require('passport');
var authRoutes = require('./server/router/userRoutes.js');
var noteRoutes = require('./server/router/noteRoutes.js');
var expressJwt = require('express-jwt');
var cors = require('cors');
var dateFormat = require('dateformat');

// winston logger to keep logs
logger.debug('overiding express logger');
//app.use(morgan('tiny',{ "stream": logger.stream }));
app.use(morgan('dev'));

// configurations
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
// initialize passport
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(cors());

// Websocket connection connected
io.on('connection', function(socket) {
  console.log('user connected');
  // Listening reminder check event from client
  socket.on('reminder check', function(note) {
    for (var i = 0; i < note.length; i++) {
      reminderInterval(note[i]);
    }
  })
  // Websocket disconnected or client/user left
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});
// reminderInterval to check the note reminder
var reminderInterval = function(note) {
  if (note.reminder == null || note.reminder == undefined) return null;
  var myInterval = setInterval(function() {
    if (note.reminder != undefined)
      if (dateFormat(note.reminder, "shortDate") == dateFormat("shortDate"))
        if (dateFormat("shortTime") == dateFormat(note.reminder, "shortTime")) {
          io.emit('get reminder', note);
          console.log(note.id + ' reminder');
          clearInterval(myInterval);
        }
  }, 6000);
}


/*****************************
 * Routes for todoApp
 *****************************/

/*******************************
 * auth routes for user
 *******************************/
app.use('/auth', authRoutes);
/*******************************
 * note routes for user notes
 *******************************/
app.use('/note', expressJwt({
  secret: 'secret'
}), noteRoutes);
// if any not found url send url not found
app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

// running serverport
http.listen(port);
console.log("Rest api started on :" + port);
module.exports = app;
