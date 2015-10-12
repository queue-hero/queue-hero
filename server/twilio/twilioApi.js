var twilio = require('twilio');
var Transaction = require('../transactions/transactionModel.js');
var User = require('./../users/userModel.js');
var accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC09e0bdb9b277603f113a06390620196a';
var authToken = process.env.TWILIO_AUTH_TOKEN || 'fe1aba99308ed506d126b80310f92f55';
var sendingNumber = process.env.TWILIO_NUMBER || '+12057917998';
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
      console.log(err, message.sid);
      //process.stdout.write(message.sid);
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
          // console.log('database requester ', user, 'request:', request);
          if (err) {
            console.log('err',err);
            res.status(500).send();
            return;
          }
          requester = user;
          phoneNumber = requester.phoneNumber;
          message = 'Good news '+ requester.firstName + '! We found a QueueHero for the request: ' +
           request.item +', ' + request.additionalRequests + ', ' + request.vendor +'@' + request.meetingAddress + ', Time: ' + request.meetingTime + '. ' +
            'Meet '+ request.queueHero + ' and pay him: ' +' $' + request.moneyExchanged + '.';
          bindedSms(phoneNumber, message, obj);
        });
    });
  }
};



