var Transaction = require('./transactionModel.js');

module.exports = {
  getTransactionHistory: function(req, res, next) {
    console.log('getting transaction history for ', req.query.username);

    res.status(201).send('here is your transaction history');
  }
};
  
