var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var middleware = require('./config/middleware.js');
var app = express();
var port = 3000;

// create test user
var createTestUsers = require('./users/testUsers.js').createTestUsers;

//starts up our mongo environment on either heroku or locathost
var database = process.env.MONGOLAB_URI || 'mongodb://localhost/queue-hero';
mongoose.connect(database, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log('mongo connected');
  }
});

createTestUsers();

// serve './../build if deployed, './../client' if local
var servePath = process.env.DEPLOYED ? './../build' : './../client';
app.use(express.static(__dirname + servePath));

middleware(app, express);

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
