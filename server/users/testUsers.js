var mongoose = require('mongoose');
var User = require('./userModel.js');

exports.createTestUsers = function() {
  User.findOne({
    username: 'johnsmith'
  })
  .then(function(user) {
    if (user) {
      console.log('user already exists');
    }
    else {
      var testUser = new User({
        username: "johnsmith",
        password: "password",
        profilePhoto: "pathToFile",
        firstName: "John",
        lastName: "Smith",
        phoneNumber: 1234567890,
        cardNumber: 111122223333,
        cvc: 123,
        expirationDate: "01/16"
      });

      testUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("created ", testUser.username);
        }
      });
    }
  });
};
