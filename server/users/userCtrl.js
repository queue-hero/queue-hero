var User = require('./userModel.js');
var Q = require('q');

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

  }
};
