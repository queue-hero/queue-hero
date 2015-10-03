var Transaction = require('../transactions/transactionModel.js');
var Q = require('q');

module.exports = {
  createTransaction: function(req, res, next) {
    
    //extract order details from req
    var requester = req.body.order.requester;
    var item = req.body.order.item;
    var moneyExchanged = req.body.order.moneyExchanged;
    var vendor = req.body.order.vendor;
    var meetingLocation = req.body.order.meetingLocation;
    var meetingTime = req.body.order.meetingTime;
    var status = 'unfulfilled';

    //TODO: (db) insert a new transaction with order details into transactions

    //FIX: send transaction id of newly created transaction to client
    console.log('Transaction was created!');
    res.sendStatus(201).send(1);
  }, 
  fulfillTransaction: function(req, res, next) {

    //extract transaction id from req
    var transactionId = req.body.transactionId;

    //TODO: (db) update the transaction status of above transaction to 'fulfilled'

    console.log('Transaction was fulfilled!')
    res.status(201).send('Transaction fulfilled!'); 
  }, 
  checkOrderAccepted: function(req, res, next) {
    //extract transaction id from req
    var transactionId = req.body.transactionId;

    //TODO: (db) check the status of above transaction, return 
    //true if status === 'accepted', false otherwise.

    //FIX: change response status to be whatever the db says
    console.log('Transaction was accepted by a queue hero!');
    res.status(201).send(true);
  }
}

