var Transaction = require('../transactions/transactionModel.js');
var Q = require('q');

module.exports = {
  createTransaction: function(req, res, next) {
    
    //extract order from req
    var item = req.body.order.item;
    var time = req.body.order.time;
    var price = req.body.order.price;

    res.writeHead(201);
    res.end();

    //TODO: insert a new transaction with order details into db
  }
}

