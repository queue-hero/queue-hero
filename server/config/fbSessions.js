var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var api_keys = require('./api_keys.js').facebook;

module.exports.restrict = function(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/#/');
};

module.exports.initialize = function(app) {

  app.use(cookieParser());

  app.use(session({
    secret: 'inception',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new FacebookStrategy({
      clientID: api_keys.clientID,
      clientSecret: api_keys.clientSecret,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      enableProof: false,
      profileFields: ['id', 'displayName', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  ));

};
