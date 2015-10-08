  var mongoose = require('mongoose');

var CheckinSchema = new mongoose.Schema({
  queueHero: {
    type: String,
    //required: true
  },
  vendor: {
    type: String,
    //required: true
  },
  vendorYelpId: {
    type: String,
    //required: true
  },
  //[address, lat, long]
  meetingLocation: {
    type: Array,
    //required: true
  },
  meetingAddress: {
    type: String,
  },
  standingInLine: {
    type: Boolean,
    //required: true,
    default: true
  },
  assigned: {
    type: Boolean,
    //required: true,
    default: false
  },
});

module.exports = mongoose.model('Checkin', CheckinSchema);
