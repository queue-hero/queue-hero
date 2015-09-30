var mongoose = require('mongoose');

var UserLocationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  }, 
  time: {
    type: Date,
    required: true,
  }, 
  transactionId: {
    type: ObjectId, 
    required: true, 
  }, 
  location: {
    type: "Point",
    coordinates: [<longitude>, <latitude>], 
    required: true, 
  }, 

});

module.exports = mongoose.model('userLocations', UserLocationSchema);

