var TransactionCtrl = require('../transactions/transactionCtrl.js');
var Transaction = require('./transactionModel.js');
var Q = require('q');

module.exports = {
  createTransaction: function(req, res, next) {
    //extract order details from req
    var requester = req.body.order.requester;
    var item = req.body.order.item;
    var additionalRequests = req.body.order.additionalRequests;
    var moneyExchanged = req.body.order.moneyExchanged;
    var vendor = req.body.order.vendor;
    var meetingLocation = req.body.order.meetingLocation;
    var meetingTime = Date.now() + req.body.order.meetingTime * 60000;
    var status = 'unfulfilled';

    var transaction = new Transaction({
      requester: requester,
      item: item,
      additionalRequests: additionalRequests,
      moneyExchanged: moneyExchanged,
      vendor: vendor,
      meetingLocation: meetingLocation,
      meetingTime: meetingTime,
      status: status
    });

    transaction.save(function(err, transaction) {
      if (err) {
        res.status(500).send();
      } else {
        res.status(201).send(transaction._id);
      }
    });

  },
  fulfillTransaction: function(req, res, next) {

    //extract transaction id from req
    var transactionId = req.body.transactionId;

    //TODO: (db) update the transaction status of above transaction to 'fulfilled'

    console.log('Transaction was fulfilled!');
    res.status(201).send('Transaction fulfilled!');
  },
  checkOrderAccepted: function(req, res, next) {
    //extract transaction id from req
    var transactionId = req.body.transactionId;

    //TODO: (db) check the status of above transaction, return
    //true if status === 'accepted', false otherwise.

    //FIX: change status to be whatever the db says
    console.log('Transaction was accepted by a queue hero!');
    res.status(201).send({
      accepted: true
    });
  },
  getActiveShops: function(req, res, next) {

    //extract area from req
    var area = req.query.area;

    //TODO: (db) find all checkins that are close to ^ area

    //FIX: change response to be array of checked in locations
    res.status(200).send(['Starbucks', 'Subway']);
  },
  rateHero: function(req, res, next) {
    //extract rating and queueHero from req
    var rating = req.body.rating;
    var queueHero = req.body.hero;

    //TODO: (db) find queuehero and update rating

    res.status(201).send('You rated your queue hero!');
  }
};
