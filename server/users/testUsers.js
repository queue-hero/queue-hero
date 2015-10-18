var mongoose = require('mongoose');
var _ = require('underscore');
var User = require('./userModel.js');
var Transaction = require('../transactions/transactionModel.js');
var Checkin = require('../checkins/checkinModel.js');
var testsRandomize = require('./testUsersRandomize.js');
var tests = testsRandomize.randomize();
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

  setInterval(simulate, 1000);
};

function simulate() {
  /*
  need to refactor, should be using tests.transactions
  and tests.checkins, not pool in the _.each
  */
  var tests = testsRandomize.randomize();
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
  });

  _.each(tests.testTransactions, function(transaction) {
    if (Math.random() > 0.9) {
      if (transaction.vendorYelpId !== 'specialtys-cafe-and-bakery-san-francisco-12') {
        transaction.status = 'unfulfilled';
        var newTransaction = new Transaction(transaction);
        newTransaction.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  });

  _.each(tests.testCheckins, function(checkin) {
    if (Math.random() > 0.9) {
      var newCheckin = new Checkin(checkin);
      newCheckin.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}
