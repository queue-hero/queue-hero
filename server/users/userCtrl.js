var User = require('./userModel.js');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var twilio = require('../twilio/twilioApi.js');

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

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      }
    }).then(function() {
      setTimeout(twilio.sendSms, 0, newUser.phoneNumber, twilio.messages.welcome);
      res.status(201).send();
      console.log('DB:', 'saved');
    });
  },

  postUserUpdate: function(req, res, next) {
    var reqUser = req.body.user;
    var facebookId = req.body.user.facebookId;
    var query = {
      facebookId: facebookId
    };

    User.update(query, reqUser)
      .then(function(rowsAffected) {
        setTimeout(twilio.sendSms, 0, reqUser.phoneNumber, twilio.messages.profile);

        if(rowsAffected.ok !== 1){
          return res.status(500).send();
        }

        res.status(201).send();
      });
  },

  saveProfilePic: function(req, res) {
    var username = req.params.username;
    console.log(username);

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var file = files.file;
      setProfilePic([username, file], function() {
        console.log("Saved profile pic to server");
        res.status(201).send();
      });
    });
  }
};


function setProfilePic(params, callback) {
  var username = params[0];
  var file = params[1];
  var fileExtension = path.extname(file.name);
  var fileName = username + fileExtension;
  var cwd = process.cwd();

  // path to directory where profile-pic is saved
  var targetPath = path.resolve(cwd + "/server/assets/profile-pic/");

  // path to profile-pic on server
  var filePathServer = targetPath + "/" + fileName;

  // create directories if it doesn't exist
  mkdirp(targetPath, function(err) {
    if (err) {
      console.error(err);
    }

    // move and rename image from temp location to filePathServer
    fs.rename(file.path, filePathServer, function(err) {
      if (err) {
        console.error(err);
      }
    });
  });

  var picFilePath = "./profile-pic/" + fileName;
  User.update({
    username: username
  }, {
    profilePhoto: picFilePath
  }, function(err, rowsAffected) {
    if (err) {
      console.log('error in db');
    }
    callback();
  });
}
