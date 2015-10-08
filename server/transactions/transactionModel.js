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
  additionalRequests: {
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
  meetingAddress: {
    type: String,
  },
  vendor: {
    type: String,
  },
  vendorYelpId: {
    type: String,
    //required: true
  },
  //unfulfilled, inprogress, complete, closed
  status: {
    type: String,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
