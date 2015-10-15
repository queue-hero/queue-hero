var Checkin = require('./checkins/checkinModel.js');
var Transaction = require('./transactions/transactionModel.js');

module.exports = function(server) {

  var path = require('path');
  var io = require('socket.io')(server);
  var users = {};

  io.on('connection', function(socket) {
    console.log('socket connected');
    // socket.on('createSocketUser', function(data) {
    //   users[data] = socket;
    // });

    socket.on('getHeroCount', function(yelpId) {
      getOpenHeroCount(yelpId, function(num) {
        socket.emit('newHeroCount', [yelpId, num]);
      });
    });

    socket.on('getRequestCount', function(yelpId) {
      getOpenRequestCount(yelpId, function(num) {
        socket.emit('newRequestCount', [yelpId, num]);
      });
    });


    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

  });


  function getOpenHeroCount(yelpId, callback) {
    Checkin.count({
      vendorYelpId: yelpId
    }, function(err, num) {
      callback(num);
    });
  }

  function getOpenRequestCount(yelpId, callback) {
    Transaction.count({
      vendorYelpId: yelpId,
      status: 'unfulfilled',
      meetingTime: { $gte: Date.now() }
    }, function(err, num) {
      callback(num);
    });
  }

};
