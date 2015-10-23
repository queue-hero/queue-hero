var auth = {};

auth.facebook = {};
auth.facebook.clientSecret = 'insertClientSecretString';
auth.facebook.clientID = insertClientIdNumber;

auth.yelp = {};
auth.yelp.consumer_key = 'insertConsumerKeyString';
auth.yelp.consumer_secret = 'insertConsumerSecretString';
auth.yelp.token = 'insertTokenString';
auth.yelp.token_secret = 'insertTokenSecretString';

auth.twilio = {};
auth.twilio.accountSid = 'insertaccountSidString';
auth.twilio.authToken = 'insertAuthTokenString';
auth.twilio.sendingNumber = 'insertSendingNumberString';

module.exports = auth;

