var mongoose = require('mongoose');
var _ = require('underscore');
var User = require('./userModel.js');
var Transaction = require('../transactions/transactionModel.js');
var Checkin = require('../checkins/checkinModel.js');
var tests = require('./testUsersRandomize.js');
var testUsers = tests.testUsers;
var testTransactions = tests.testTransactions;
var testCheckins = tests.testCheckins;



exports.createTestUsers = function() {
  User.findOne({
    username: 'rachel'
  }).then(function(user){
    if(!user){
      _.each(testUsers, function(testUser){
        var newUser = new User(testUser);
        newUser.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      });

      _.each(testTransactions, function(testTransaction){
        var newTransaction = new Transaction(testTransaction);
        newTransaction.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      });

      _.each(testCheckins, function(testCheckin){
        var newCheckin = new Checkin(testCheckin);
        newCheckin.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  });
};
