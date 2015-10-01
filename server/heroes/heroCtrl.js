var Transaction = require('../transactions/transactionModel.js');


module.exports = {
  checkOrderComplete: function (req, res, next) {
    //get transaction id from request
    var transactionId = req.body.transactionId;

    //check whether that transaction has status complete
    var transactionStatus = Transaction.getStatus();

    //send the transaction status back to client
    if (transactionStatus === 'complete') {
      res.send(true);
    } else {
      res.send(false);
    }

  }
}
