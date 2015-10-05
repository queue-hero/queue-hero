var mongoose = require('mongoose');
var User = require('./userModel.js');
var Transaction = require('../transactions/transactionModel.js');
var Checkin = require('../checkins/checkinModel.js');

exports.createTestUsers = function() {
  User.findOne({
    username: 'johnsmith'
  })
  .then(function(user) {
    if (user) {
    }
    else {
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
        } else {
        }
      });
    }
  });

  User.findOne({
    username: 'NapoleonB'
  })
  .then(function(user){
    if(user){
    } else {
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
        } else {
        }
      });
    }
  });

  Checkin.findOne({
    queueHero: 'johnsmith',
    vendor: 'Chipotle'
  })
  .then(function(checkin){
    if (checkin){
    } else {
      var testCheckIn1 = new Checkin ({
        queueHero:'johnsmith',
        vendor:'Chipotle',
        meetingLocation:'126 New Montgomery St, San Francisco, CA 94105',
        standingInLine:true,
        assigned:false
      });
      testCheckIn1.save(function(err) {
        if (err) {
          console.log(err);
        } else {
        }
      });
    }
  });

  Checkin.findOne({
    queueHero:'10153623461113905',
    vendor:'sushirrito'
  })
  .then(function(checkin){
    if (checkin){
    } else {
      var testCheckIn2 = new Checkin({
        queueHero:'NapoleonB',
        vendor:'sushirrito',
        meetingLocation:'59 New Montgomery St, San Francisco, CA 94105',
        standingInLine:true,
        assigned:true
      });
      testCheckIn2.save(function(err) {
        if (err) {
          console.log(err);
        } else {
        }
      });
    }
  });

    Checkin.findOne({
      queueHero:'NapoleonB',
      vendor:'kebab'
  })
  .then(function(checkin){
    if (checkin){
    } else {
      var testCheckIn3 = new Checkin({
        queueHero:'NapoleonB',
        vendor:'kebab',
        meetingLocation:'156 New Montgomery St, San Francisco, CA 94105',
        standingInLine:false,
        assigned:false
      });
      testCheckIn3.save(function(err) {
        if (err) {
          console.log(err);
        } else {
        }
      });
    }
  });

  var testTransaction1 =  new Transaction({
    queueHero: '',
    requester: 'NapoleonB',
    item: 'milk coffee',
    additionalRequests: 'siracha',
    moneyExchange:13,
    meetingTime: new Date(),
    meetingLocation: ['156 New Montgomery St, San Francisco, CA 94105', 37.776740, -122.416371],
    vendor: 'starbucks',
    status: 'open'
  });
  testTransaction1.save(function(err) {
    if (err) {
      console.log(err);
    } else {
    }
  });
  var testTransaction2 = new Transaction({
    queueHero: 'NapoleonB',
    requester: 'johnsmith',
    item: 'sweet coffee',
    additionalRequests: 'lots of splenda and 5 icecubs',
    moneyExchange:13,
    meetingTime: new Date(),
    meetingLocation: ['59 New Montgomery St, San Francisco, CA 94105', 37.776740, -122.416371],
    vendor: 'sushirrito',
    status: 'fulfilled'
  });
  testTransaction2.save(function(err) {
    if (err) {
      console.log(err);
    } else {
    }
    });
};

