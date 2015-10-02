var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var middleware = require('./config/middleware.js');
var app = express();
var port = 3000;

//starts up our mongo environment on either heroku or locathost
//var database = process.env.MONGOLAB_URI || 'mongodb://localhost/queue-hero';

var database = 'mongodb://localhost/queue-hero';
mongoose.connect(database, function(error) {
  if (error) {
    console.error(error);
  }
  else {
    console.log('mongo connected');
  }
});

app.use(express.static(__dirname + './../client'));

middleware(app, express);

app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
