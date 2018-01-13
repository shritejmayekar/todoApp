require('./server/config');
var express = require('express');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var Task = require('./server/model');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

var logger = require('./logger');
var config = require("./config.json");
const winston = require('winston');
const fs = require('fs');

logger.debug('overiding express logger');
app.use(require('morgan')({ "stream": logger.stream }));


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: true
}));
require('./server/router/todoRoute.js')(app);
app.use(function(req, res) {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});
app.listen(port);
console.log("Rest api started on :" + port);
