var cfg = {};

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC09e0bdb9b277603f113a06390620196a';
cfg.authToken = process.env.TWILIO_AUTH_TOKEN || 'fe1aba99308ed506d126b80310f92f55';
cfg.sendingNumber = process.env.TWILIO_NUMBER || '+12057917998';

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
var isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

  throw new Error(errorMessage);
}

// Export configuration object
module.exports = cfg;
