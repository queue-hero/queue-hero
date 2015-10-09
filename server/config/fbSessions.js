var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./../users/userModel.js');

var api_keys;

// load apikeys if localhost. process.env.DEPLOYED set in heroku
if (!process.env.DEPLOYED) {
  api_keys = require('../config/api_keys.js').facebook;
}

module.exports.restrict = function(req, res, next) {
  if (req.isAuthenticated()) {
    var userId = req.session.passport.user.id;
    User.findOne({
      facebookId: userId
    }, 'username', function(err, user) {
      if (err) {
        res.status(403).send();
        return;
      }
      if (user && user.username !== null) {
        next();
      } else {
        req.logout();
        res.status(403).send();
      }
    });
  }else{
    return res.status(403).send();
  }
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
  var herokuUrl = 'https://queue-hero.herokuapp.com/auth/facebook/callback';
  var localUrl = 'http://localhost:3000/auth/facebook/callback';
  var serverUrl = process.env.DEPLOYED ? herokuUrl : localUrl;
  // use environment variable set in heroku if deployed, api_keys.js if local
  passport.use(new FacebookStrategy({
      clientID: process.env.FB_CLIENT_ID || api_keys.clientID,
      clientSecret: process.env.FB_CLIENT_SECRET || api_keys.clientSecret,
      callbackURL: serverUrl,
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
