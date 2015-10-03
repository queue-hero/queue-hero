var Transaction = require('../transactions/transactionModel.js');
var Auth = require('../auth/api_keys.js');
var Yelp = require("yelp");
var Q = require('q');

module.exports = {

  /*
   * @param {Object} on req.query {lat: lat, long: long}
   * @return {Object} Object with map and location options
   */
  getLocationOptions: function(req, res, next) {
    var lat = req.query.lat;
    var long = req.query.long;
    var location = lat + ',' + long;
    console.log(location);
    var yelp = Yelp.createClient({
      consumer_key: Auth.yelp.consumer_key,
      consumer_secret: Auth.yelp.consumer_secret,
      token: Auth.yelp.token,
      token_secret: Auth.yelp.token_secret
    });

    yelp.search({ll: location}, function(error, data) {
      console.log(error);
      console.log(data);
    });
  },

  checkOrderComplete: function(req, res, next) {
    console.log('Executing checkOrderComplete');
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

  }
};
