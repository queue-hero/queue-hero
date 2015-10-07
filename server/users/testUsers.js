var mongoose = require('mongoose');
var User = require('./userModel.js');
var Transaction = require('../transactions/transactionModel.js');
var Checkin = require('../checkins/checkinModel.js');

exports.createTestUsers = function() {
  User.findOne({
    username: 'johnsmith'
  })
    .then(function(user) {
      if (user) {} else {
        var testUser = new User({
          "facebookId": "10153623461113905",
          "profilePhoto": "placeholder/image",
          "username": "johnsmith",
          "firstName": "John",
          "lastName": "Smith",
          "phoneNumber": 16692269013,
          "cardNumber": 9901230120130,
          "cvc": "123",
          "expirationDate": '11/14',
          "billingAddress": "Stonegate Drive",
          "city": "San Francisco",
          "state": "California",
          "country": "USA",
        });

        testUser.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

  User.findOne({
    username: 'NapoleonB'
  })
    .then(function(user) {
      if (user) {} else {
        var newTestUser = new User({
          "facebookId": "10153623461113907",
          "profilePhoto": "placeholder/image",
          "username": "NapoleonB",
          "firstName": "Napoleon",
          "lastName": "Bonaparte",
          "phoneNumber": 16692269013,
          "cardNumber": 9901230120139,
          "cvc": "123",
          "expirationDate": '11/14',
          "billingAddress": "Allende 115",
          "city": "San Francisco",
          "state": "California",
          "country": "USA",
        });
        newTestUser.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

  Checkin.findOne({
    queueHero: 'johnsmith',
    vendor: 'Chipotle'
  })
    .then(function(checkin) {
      if (checkin) {} else {
        var testCheckIn1 = new Checkin({
          queueHero: 'johnsmith',
          vendor: 'Chipotle',
          meetingLocation: [37.776740, -122.416371],
          standingInLine: true,
          assigned: false
        });
        testCheckIn1.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

  Checkin.findOne({
    queueHero: '10153623461113905',
    vendor: 'sushirrito'
  })
    .then(function(checkin) {
      if (checkin) {} else {
        var testCheckIn2 = new Checkin({
          queueHero: 'NapoleonB',
          vendor: 'sushirrito',
          meetingLocation: [38.897147, -77.043934],
          standingInLine: true,
          assigned: true
        });
        testCheckIn2.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

  Checkin.findOne({
    queueHero: 'NapoleonB',
    vendor: 'kebab'
  })
    .then(function(checkin) {
      if (checkin) {} else {
        var testCheckIn3 = new Checkin({
          queueHero: 'NapoleonB',
          vendor: 'kebab',
          meetingLocation: [37.776740, -122.416371],
          standingInLine: false,
          assigned: false
        });
        testCheckIn3.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

  Transaction.findOne({
    requester: 'NapoleonB',
    item: 'milk coffee',
    additionalRequests: 'siracha'
  })
    .then(function(transaction) {
      if (transaction) {} else {
        var testTransaction1 = new Transaction({
          queueHero: '',
          requester: 'NapoleonB',
          item: 'milk coffee',
          additionalRequests: 'siracha',
          moneyExchanged: 13,
          meetingTime: new Date(),
          meetingLocation: [37.776740, -122.416371],
          vendor: 'starbucks',
          status: 'unfulfilled'
        });
        testTransaction1.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

  Transaction.findOne({
    queueHero: 'NapoleonB',
    requester: 'johnsmith',
    item: 'sweet coffee'
  })
    .then(function(transaction) {
      if (transaction) {} else {
        var testTransaction2 = new Transaction({
          queueHero: 'NapoleonB',
          requester: 'johnsmith',
          item: 'sweet coffee',
          additionalRequests: 'lots of splenda and 5 icecubs',
          moneyExchanged: 13,
          meetingTime: new Date(),
          meetingLocation: [37.776740, -122.416371],
          vendor: 'sushirrito',
          status: 'complete'
        });
        testTransaction2.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });

};
