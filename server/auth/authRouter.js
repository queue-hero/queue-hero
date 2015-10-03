var authCtrl = require('./authCtrl.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var api_keys = require('./api_keys.js').facebook;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: api_keys.clientID,
    clientSecret: api_keys.clientSecret,
    callbackURL: "http://localhost:300  0/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

module.exports = function(app) {
  // Still need to add specific method to call for each route
  // app.get('', authCtrl.doThis())


  app.use(passport.initialize());

  app.get('/facebook', passport.authenticate('facebook'));

  app.get('/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/login'
    }),
    function(req, res) {
      // Successful authentication, tell user login was successful
      res.redirect('/#/choice');
    });

};
