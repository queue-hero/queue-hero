var Transaction = require('../transactions/transactionModel.js');
var Q = require('q');

module.exports = {
  checkOrderComplete: function (req, res, next) {
    console.log('Executing checkOrderComplete');
    //get transaction id from request
    var transactionId = req.body.transactionId;

    //find transaction, and then check if status is complete
    // var findTransaction = Q.nbind(Transaction.findOne, Transaction);
    // findTransaction({_id: transactionId})
    //   .then(function (transaction) {
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

  }
}
