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

    // store venue info from yelp
    var venues = {};

    var yelp = Yelp.createClient({
      consumer_key: Auth.yelp.consumer_key,
      consumer_secret: Auth.yelp.consumer_secret,
      token: Auth.yelp.token,
      token_secret: Auth.yelp.token_secret
    });

    /*
     * Yelp search parameters
     *
     * search method: ll = search by lat,long | location = search by address
     * sort: 0 = Best Matched, 1 = Distance, 2 = Highest Rated
     * category_filter: see http://bit.ly/1Lp7Mhr
     * radius_filter: search radius in meters
     * limit: number of results
     */
    yelp.search({ll: location, sort: 1, category_filter: 'food', radius_filter: 300, limit: 10}, function(error, data) {
      var venuesFromYelp = data.businesses;
      venuesFromYelp.forEach(function(value){
        venues[value.name] = {
          name: value.name,
          address: value.location.address,
          city: value.location.city,
          state: value.location.state_code,
          zip: value.location.postal_code,
          // displayAddress in []. May include building name + full address
          displayAddress: value.location.display_address,
          lat: value.location.coordinate.latitude,
          long: value.location.coordinate.longitude,
          // ########## format
          phone: value.phone,
          // +1-###-###-#### format
          displayPhone: value.display_phone,
          // distance from hero in meters
          distance: value.distance,
          categories: value.categories,
          image_url: value.image_url
        };
      });
      res.send(venues);
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
