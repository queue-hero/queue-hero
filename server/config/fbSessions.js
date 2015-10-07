var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;

var api_keys;

// load apikeys if localhost. process.env.DEPLOYED set in heroku
if (!process.env.DEPLOYED) {
  api_keys = require('../config/api_keys.js').facebook;
}

module.exports.restrict = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  next();
};

module.exports.initialize = function(app) {

  app.use(cookieParser());

  app.use(session({
    secret: 'inception',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: false }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // use herokuUrl if deployed, else use localhost:3000
  var herokuUrl = 'https://queue-hero.herokuapp.com';
  var serverUrl = process.env.DEPLOYED ? herokuUrl : 'http://localhost:3000';
  // use environment variable set in heroku if deployed, api_keys.js if local
  passport.use(new FacebookStrategy({
      clientID: process.env.FB_CLIENT_ID || api_keys.clientID,
      clientSecret: process.env.FB_CLIENT_SECRET || api_keys.clientSecret,
      callbackURL: serverUrl + '/auth/facebook/callback',
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
