var mongoose = require('mongoose');
var Transaction = require('./transactionModel.js');

exports.createTransaction = function(order) {

  var transaction = new Transaction({
    requester: order.requester,
    item: order.item,
    additionalRequests: order.additionalRequests,
    moneyExchanged: order.moneyExchanged,
    meetingTime: order.meetingTime,
    meetingLocation: [1, 1],
    vendor: order.vendor,
    status: order.status
  });

  transaction.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("created new transaction");
    }
  });

  console.log('Saved new transaction to db');
};
