var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String,
    required: true,
    default: 'placeholder/image'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  cardNumber: {
    type: Number,
    required: true,
    unique: true
  },
  cvc: {
    type: Number,
    required: true
  },
  expirationDate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
