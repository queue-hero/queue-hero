  var mongoose = require('mongoose');

var CheckinSchema = new mongoose.Schema({
  queueHero: {
    type: String,
  },
  vendor: {
    type: String,
  },
  vendorYelpId: {
    type: String,
  },
  //[lat, long]
  meetingLocation: {
    type: Array,
    //required: true
  },
  meetingAddress: {
    type: String,
  },
  assigned: {
    type: Boolean,
    //required: true,
    default: false
  },
});

module.exports = mongoose.model('Checkin', CheckinSchema);
