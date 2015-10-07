var User = require('./userModel.js');

module.exports = {
  getUserData: function(req, res, next) {
    var facebookId = req.query.facebookId;
    User.findOne({
      facebookId: facebookId
    }, function(err, user) {
      if (err) {
        return next(err);
      }
      res.status(201).send(user);
    });
  },
  postUserData: function(req, res, next) {
    var reqUser = req.body.user;
    var newUser = new User({
      username: reqUser.username,
      facebookId: reqUser.facebookId,
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
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
    }).then(function() {
      console.log('DB:', 'saved');
      res.status(201).send('User created');
    });
  },
  postUserUpdate: function(req, res, next) {
    var reqUser = req.body.user;
    var facebookId = req.body.user.facebookId;
    var query = { facebookId: facebookId };
    User.update(query, reqUser)
    .then(function(err, num) {
      console.log('updateCallback:', err || num);
      console.log('DB:', 'update');
      res.status(201).send('User updated');
    });
  }
};

