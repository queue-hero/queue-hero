module.exports = function(server) {

  var path = require('path');
  var io = require('socket.io')(server);
  var users = {};

  io.on('connection', function(socket) {
    // socket.on('createSocketUser', function(data){
    //   users[data] = socket;
    // });

  });

};
