var mongoose = require('mongoose');

var CheckinSchema = new mongoose.Schema({
  queueHero: {
    type: String,
    required: true, 
  }, 
  vendor: {
    type: String, 
    required: true, 
  },
  meetingLocation: {
    type: "Point",
    coordinates: [ <longitude>, <latitude> ], 
    required: true, 
  }, 
  standingInLine: { 
    type: Boolean, 
    required: true,
    default: true
  }, 
  assigned: {
    type: Boolean, 
    required: true, 
    default: false
  },  
});

module.exports = mongoose.model('checkins', CheckinSchema);
