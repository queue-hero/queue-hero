var passport = require('passport');
var User = require('./../users/userModel.js');

module.exports = {
  initialLogin: passport.authenticate('facebook'),

  redirect: passport.authenticate('facebook', { failureRedirect: '/#/' }),

  findUser: function(req, res) {
    var userId = req.session.passport.user.id;
    res.cookie('com.queuehero', userId);

    User.findOne({
      facebookId: userId
    }, function(err, user) {
      if (err) {
        req.logout();
        res.redirect('/#/');
        return;
      }
      if (user && user.username !== null) {
        res.redirect('/#/choice');
        return;
      } else {
        res.redirect('/#/signup');
        return;
      }
    });
  }

};
