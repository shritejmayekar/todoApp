require('./server/config');
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
var passport = require('passport');
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
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
require('./server/router/todoRoute.js')(app);
app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

app.listen(port);
console.log("Rest api started on :" + port);
