var transactionCtrl = require('./transactionCtrl.js');

module.exports = function(app) {
  //req: params object with username
  //res: object with transactions that username has been involved in
  app.get('/', transactionCtrl.getTransactionHistory);
};
