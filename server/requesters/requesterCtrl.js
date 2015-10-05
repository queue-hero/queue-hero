var TransactionCtrl = require('../transactions/transactionCtrl.js');
var Transaction = require('../transactions/transactionModel.js');
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
    var meetingTime = Date.now() + req.body.order.meetingTime*60000;
    var status = 'unfulfilled';

    var order = {
      requester: requester,
      item: item,
      additionalRequests: additionalRequests,
      moneyExchanged: moneyExchanged,
      vendor: vendor,
      meetingLocation: meetingLocation,
      meetingTime: meetingTime,
      status: status
    };

    //TODO: (db) insert a new transaction with order details into transactions

    TransactionCtrl.createTransaction(order);

    //FIX: change response to be id of newly created transaction
    console.log('Transaction was created!');
    res.sendStatus(201).send(1);
  },
  fulfillTransaction: function(req, res, next) {

    //extract transaction id from req
    var transactionId = req.body.transactionId;
    Transaction.update({ _id: transactionId }, {status: 'complete'}, function(err, affected){
      if(err){
        res.status(500).send();
      }
      if(affected.ok === 1){
        res.status(201).send();
      }
      res.status(500).send();
    });

    //TODO: (db) update the transaction status of above transaction to 'fulfilled'

  },
  checkOrderAccepted: function(req, res, next) {
    //extract transaction id from req
    var transactionId = req.query.transactionId;

    Transaction.findOne({ _id: transactionId }, function(err, user){
      if(err){
        res.status(500).send();
      }
      if(!user){
        res.status(401).send();
      }

      if(user.queueHero){
        res.status(200).send(user.queueHero);
      }
      console.log('here');
      res.status(200).send(false);
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

