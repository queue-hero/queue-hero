var twilio = require('twilio');

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
  }

};



