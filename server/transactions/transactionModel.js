var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  queueHero: {
    type: String,
  },
  requester: {
    type: String,
  },
  item: {
    type: String,
  },
  moneyExchanged: {
    type: Number,
  },
  meetingTime: {
    type: Date,
  },
  //[lat, long]
  meetingLocation: {
    type: Array,
  },
  vendor: {
    type: String,
  },
  status: {
    type: String,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
