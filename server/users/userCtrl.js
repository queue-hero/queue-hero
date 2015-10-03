var User = require('./userModel.js');

module.exports = {
  getUserData: function(req, res, next) {
    console.log('here');
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
