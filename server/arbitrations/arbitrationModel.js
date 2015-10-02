var mongoose = require('mongoose');

var ArbitrationSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
  },
  queueHero: {
    type: String,
    required: true,
  },
  requester: {
    type: String,
    required: true,
  },
  resolved: {
    type: Boolean,
    required: true,
    default: false,
  }
});


module.exports = mongoose.model('Arbitration', ArbitrationSchema);
