var mongoose = require('mongoose');
var _ = require('underscore');
var User = require('./userModel.js');
var Transaction = require('../transactions/transactionModel.js');
var Checkin = require('../checkins/checkinModel.js');
var testUsersRandomize = require('./testUsersRandomize.js');
var tests = testUsersRandomize.randomize();
var testUsers = tests.testUsers;
var testTransactions = tests.testTransactions;
var testCheckins = tests.testCheckins;
var pool = tests.pool;



exports.createTestUsers = function() {
  User.findOne({
    username: 'rachel'
  }).then(function(user) {
    if (!user) {
      Checkin.remove({}, function(err) {
        Transaction.remove({}, function(err) {
          _.each(testUsers, function(testUser) {
            var newUser = new User(testUser);
            newUser.save(function(err) {
              if (err) {
                console.log(err);
              }
            });
          });

          _.each(testTransactions, function(testTransaction) {
            var newTransaction = new Transaction(testTransaction);
            newTransaction.save(function(err) {
              if (err) {
                console.log(err);
              }
            });
          });

          _.each(testCheckins, function(testCheckin) {
            var newCheckin = new Checkin(testCheckin);
            newCheckin.save(function(err) {
              if (err) {
                console.log(err);
              }
            });
          });
        });
      });
    }
  });

  setInterval(simulate, 4000);
};

function simulate() {
  var tests = testUsersRandomize.randomize();
  var count = 0;
  _.each(pool, function(user, key, list) {
    if (Math.random() < 0.20) {
      Checkin.remove({
        username: key
      }, function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
    if (Math.random() < 0.20) {
      Transaction.remove({
        username: key
      }, function(err) {
        if (err) {
          console.log(err);
        }
      });
    }

    if (Math.random() > 0.95) {
      testTransactions[count].status = 'unfulfilled';
      var newTransaction = new Transaction(testTransactions[count]);
      newTransaction.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
    if (Math.random() > 0.80) {
      var newCheckin = new Checkin(testCheckins[count]);
      newCheckin.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
    count++;
  });



}
