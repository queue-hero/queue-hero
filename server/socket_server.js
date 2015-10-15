var Checkin = require('./checkins/checkinModel.js');
var Transaction = require('./transactions/transactionModel.js');
var Q = require('q');

module.exports = function(server) {

  var path = require('path');
  var io = require('socket.io')(server);
  // var users = {};

  io.on('connection', function(socket) {
    console.log('socket connected');
    // socket.on('createSocketUser', function(data) {
    //   users[data] = socket;
    // });

    //from requesterTaskCtrl
    socket.on('getHeroCount', function(yelpId) {
      getOpenHeroCount(yelpId, function(num) {
        socket.emit('newHeroCount', [yelpId, num]);
      });
    });

    //from heroLocationCtrl
    socket.on('getRequestCount', function(yelpId) {
      getOpenRequestCount(yelpId, function(num) {
        socket.emit('newRequestCount', [yelpId, num]);
      });
    });

    //from heroTaskCtrl
    socket.on('getOpenRequests', function(yelpId) {
      getOpenRequests(yelpId, function(transactions) {
        socket.emit('newOpenRequests', transactions);
      });
    });

    //from heroOrderCtrl
    socket.on('isOrderComplete', function(transactionId) {
      checkOrderComplete(transactionId, function(bool) {
        socket.emit('checkOrderComplete', bool);
      });
    });


    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

  });

  //from requesterTaskCtrl
  function getOpenHeroCount(yelpId, callback) {
    Checkin.count({
      vendorYelpId: yelpId
    }, function(err, num) {
      callback(num);
    });
  }

  //from heroLocationCtrl
  function getOpenRequestCount(yelpId, callback) {
    Transaction.count({
      vendorYelpId: yelpId,
      status: 'unfulfilled',
      meetingTime: {
        $gte: Date.now()
      }
    }, function(err, num) {
      callback(num);
    });
  }

  //from heroTaskCtrl
  function getOpenRequests(yelpId, callback) {
    Transaction.find({
      status: 'unfulfilled',
      vendorYelpId: yelpId,
      meetingTime: {
        $gte: Date.now()
      }
    }, function(err, transactions) {
      callback(transactions);
    });
  }

  //from heroOrderCtrl
  function checkOrderComplete(transactionId, callback) {
    // find transaction, and then check if status is complete
    var findTransaction = Q.nbind(Transaction.count, Transaction);
    findTransaction({
      _id: transactionId,
      status: 'complete'
    })
      .then(function(count) {
        count === 1 ? callback(true) : callback(false);
      });
  }

};
