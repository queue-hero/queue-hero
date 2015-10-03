var authCtrl = require('./authCtrl.js');
var passport = require('passport');
var User = require('./../users/userModel.js');

module.exports = function(app) {
  // Still need to add specific method to call for each route
  // app.get('', authCtrl.doThis())

  app.get('/facebook', passport.authenticate('facebook'));

  app.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/#/' }),
    function(req, res) {
      var userId = req.session.passport.user.id;
      res.cookie('com.queuehero', userId);

      User.findOne({
        facebookId: userId
      }, function(err, user) {
        if (err) {
          req.logout();
          res.redirect('/#/');
        }
        if (user && user.username !== null) {
          res.redirect('/#/choice');
        } else {
          res.redirect('/#/signup');
        }
      });
    });
};
