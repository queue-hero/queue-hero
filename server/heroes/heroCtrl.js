var Transaction = require('../transactions/transactionModel.js');
var Q = require('q');

module.exports = {
  checkOrderComplete: function(req, res, next) {
    //get transaction id from request
    var transactionId = req.body.transactionId;

    //find transaction, and then check if status is complete
    // var findTransaction = Q.nbind(Transaction.findOne, Transaction);
    // findTransaction({_id: transactionId})
    //   .then(function(transaction) {
    //     if (!transaction) {
    //       console.log('transaction does not exist');
    //       res.send(false);
    //     } else {
    //       if (transaction.status === 'complete') {
    //         res.send(true);
    //       } else {
    //         res.send(false);
    //       }
    //     }
    //   })
    //   .fail(function (error) {
    //     next(error);
    //   });

    //TODO: interface with db, always sends true
    res.status(201).send(true);

  }, 
  acceptRequest: function(req, res, next) {
    //get transaction id from request
    var transactionId = req.body.transactionId;

    //TODO: update status of transaction in db
    //from unfulfilled to in progress

    res.status(201).send('You have accepted a request');
  }, 
  getOpenRequests: function(req, res, next) {
    //get location from request
    var location = req.query.location;

    //TODO: find all transactions with location = ^

    //dummy data (needs to be gotten from the db)
    var orders = [{
        time: "2015-10-02T05:20:58.409Z",
        item: 'starbucks mocha frappe',
        requester: 'Darrin',
        transactionId: 10923,
        price: 6,
      }, {
        time: "2015-10-02T05:27:58.409Z",
        item: 'Americano',
        requester: 'Tatsumi',
        transactionId: 12,
        price: 3,
      }, {
        time: "2015-10-02T05:23:21.892Z",
        item: 'cookie',
        requester: 'Shreeya',
        transactionId: 1223,
        price: 2,

      }
    ];

    orders = JSON.stringify(orders);
    
    res.status(201).send(orders);
  }
}
