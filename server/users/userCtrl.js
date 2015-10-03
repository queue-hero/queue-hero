var User = require('./userModel.js');

module.exports = {
  getUserData: function(req, res, next) {
    var username = req.query.username;
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return next(err);
      }
      res.status(201).send(user);
    });
  },
  postUserData: function(req, res, next) {
    var reqUser = req.body.user;
    // console.log('reqUser:',reqUser);
    var newUser = new User({
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      phoneNumber: reqUser.phoneNumber,
      cardNumber: reqUser.creditCard,
      cvc: reqUser.cvc,
      expirationDate: reqUser.expDate,
      billingAddress: reqUser.billingAddress,
      city: reqUser.city,
      state: reqUser.state,
      country: reqUser.country
    });
    // console.log('DB:',newUser);
    res.status(201).send('User created');
  }
};

