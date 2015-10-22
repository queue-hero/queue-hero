var twilio = require('twilio');
var Transaction = require('../transactions/transactionModel.js');
var User = require('./../users/userModel.js');

var api_keys;

if (!process.env.DEPLOYED) {
  api_keys = require('../config/api_keys.js').twilio;
}

var accountSid = process.env.TWILIO_ACCOUNT_SID || api_keys.accountSid;
var authToken = process.env.TWILIO_AUTH_TOKEN || api_keys.authToken;
var sendingNumber = process.env.TWILIO_NUMBER || api_keys.sendingNumber;

var client = new twilio.RestClient(accountSid, authToken);

// Export configuration object
module.exports= {

  messages: {
    welcome: "Ahoy from Qhero! Welcome to San Francisco's Queueless adventure!<3",
    instruction: "Queue Hero would only send you SMS when one of your request gets picked by a Hero. Have Fun!",
    profile: "Security update: Your QueueHero profile information was updated"
   },

  sendSms: function(phonenumber, text) {
    client.messages.create({
      to: "+1" + phonenumber,
      from: "+12057917998",
      body: text,
    }, function(err, message) {
      if (err) {
        console.log('twilio Error:', err);
      } else {
        console.log('twilioId:', message.sid);
      }
    });
  },

  smsRequestAccepted: function(transactionId) {
    var requester;
    var message = '';
    var phoneNumber = '';
    var obj = this;
    //binds this for later call inside the db query callback
    var bindedSms = function(toNumber, text, obj) {
      obj.sendSms(toNumber, text);
    };
    //query db for the transaction and the requester user
    Transaction.findOne({
        _id: transactionId
      }, function(err, request) {
        if (err) {
          res.status(500).send();
          return;
        }
        var requesterUsername = request.requester;
        User.findOne({
          username: requesterUsername
        }, function(err, user) {
          if (err) {
            console.log('err',err);
            res.status(500).send();
            return;
          }
          requester = user;
          phoneNumber = requester.phoneNumber;
          message = 'Good news '+ requester.firstName + '! We found a QueueHero for the request: ' +
           request.item +', ' + request.additionalRequests + ', ' + request.vendor +' @ ' + request.meetingAddress + ', Time: ' + request.meetingTime + '. ' +
            'Meet '+ request.queueHero + ' and pay him: ' +' $' + request.moneyExchanged + '.';
          bindedSms(phoneNumber, message, obj);
        });
    });
  }
};



