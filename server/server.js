var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var middleware = require('./config/middleware.js');
var sockets = require('./socket_server.js');
var app = express();
var server = http.createServer(app);
var port = 3000;

sockets(server);

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
app.use(express.static(__dirname + './../server/assets'));

middleware(app, express);

var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
