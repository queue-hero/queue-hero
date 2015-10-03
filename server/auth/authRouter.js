var authCtrl = require('./authCtrl.js');
var passport = require('passport');

module.exports = function(app) {
  // Still need to add specific method to call for each route
  // app.get('', authCtrl.doThis())

  app.get('/facebook', passport.authenticate('facebook'));

  app.get('/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/#/'
    }),
    function(req, res) {
      // Successful authentication, tell user login was successful
      res.redirect('/#/choice');
    });

};
