var Transaction = require('./transactionModel.js');

module.exports = {
  getTransactionHistory: function(req, res, next) {
    var username = req.query.username;

    Transaction.find({
      $or: [ { queueHero: username }, { requester: username } ]
    }, function(err, transactions) {
      if (err) {
        console.log(err);
        res.status(500).send();
        return;
      } else {
        res.status(200).send(transactions);
      }

    });
  }
};
  
