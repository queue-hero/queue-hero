var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  queueHero: {
    type: String,
    required: true
  },
  requester: {
    type: String,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  moneyExchanged: {
    type: Number,
    required: true
  },
  meetingTime: {
    type: Date,
    required: true
  },
  //[lat, long]
  meetingLocation: {
    type: Array,
    required: true
  },
  vendor: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
