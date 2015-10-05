var Transaction = require('../transactions/transactionModel.js');
var Checkin = require('../checkins/checkinModel.js');
var Auth = require('../config/api_keys.js');
var Yelp = require("yelp");
var Q = require('q');
var User = require('./../users/userModel.js');

module.exports = {

  /*
   * @param {Object} on req.query {lat: lat, long: long}
   * @return {Array} Array with map and location options
   */
  getLocationOptions: function(req, res, next) {
    var lat = req.query.lat;
    var long = req.query.long;
    var location = lat + ',' + long;

    // store venue info from yelp
    var venues = [];

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
    yelp.search({
      ll: location,
      sort: 1,
      category_filter: 'food',
      radius_filter: 300,
      limit: 10
    }, function(error, data) {
      var venuesFromYelp = data.businesses;
      venuesFromYelp.forEach(function(value) {
        venues.push({
          yelpId: value.id,
          name: value.name,
          //address: value.location.address,
          //city: value.location.city,
          //state: value.location.state_code,
          //zip: value.location.postal_code,

          // displayAddress in []. May include building name + full address
          displayAddress: value.location.display_address.join(' '),

          lat: value.location.coordinate.latitude,
          long: value.location.coordinate.longitude,

          // ########## format
          //phone: value.phone,

          // +1-###-###-#### format
          //displayPhone: value.display_phone,

          // distance from hero in meters
          //distance: value.distance,

          //categories: value.categories,
          //image_url: value.image_url
        });
      });
      res.status(200).send(venues);
    });
  },

  /*
   * @param {Object} queuehero: queuehero, location: location
   * @return {String} checkin._id
   */
  setLocation: function(req, res, next) {
    var location = req.body.location;
    var queueHero = req.body.queueHero;

    var newCheckin = new Checkin({
      queueHero: queueHero,
      vendor: location.name,
      meetingLocation: [location.lat, location.long]
    });

    newCheckin.save(function(err) {
      if (err) {
        consoole.log(err);
      } else {
   // returning newCheckin._id, may use it in /hero/task
        res.status(201).send(newCheckin._id);
      }
    });
  },

  checkOrderComplete: function(req, res, next) {
    //get transaction id from request
    var transactionId = req.query.transactionId;

    // find transaction, and then check if status is complete
    var findTransaction = Q.nbind(Transaction.findOne, Transaction);
    findTransaction({ _id: transactionId })
      .then(function(transaction) {
        if (!transaction) {
          console.log('transaction does not exist');
          res.status(401).send();
        } else {
          if (transaction.status === 'complete') {
            res.status(200).send(true);
          } else {
            res.status(200).send(false);
          }
        }
      })
      .fail(function (error) {
        res.status(401).send();
      });

  },

  acceptRequest: function(req, res, next) {
    //get transaction id from request
    var transactionId = req.body.transactionId;
    var queueHero = req.body.queueHero;
    var update = {
      queueHero: queueHero,
      status: 'inprogress'
    };

    Transaction.update({ _id: transactionId }, update, function(err, rowsAffected) {
      if (err) {
        res.status(500).send();
      }
      if (rowsAffected.ok === 1) {
        Checkin.update({ _id: transactionId }, { assigned: true }, function(err) {
          if (err) {
            res.status(500).send();
          }
          res.status(204).send();
        });

      } else {
        res.status(500).send();
      }

    });

  },

  getOpenRequests: function(req, res, next) {
    //get location from request
    var location = req.query.location;

    //TODO: (db) find all transactions with location = ^
    //currently this query just gets all transactions that are not complete
    Transaction.find({ status: { $ne: 'complete' } }, function(err, transactions) {
      if (err) {
        res.status(500).send();
      }
      res.status(200).send(transactions);

    });

  },

  rateRequester: function(req, res, next) {
    //get rating and requester from request
    var rating = req.body.rating;
    var requester = req.body.requester;
    var transactionId = req.body.transactionId;

    User.findOne({ username: requester }, function(err, user) {
      if (err) {
        res.status(500).send();
      }
      if (!user) {
        res.status(401).send();
      }
      var ratings = user.ratings;
      ratings.transactionId = rating;
      User.update({ username: requester }, { ratings: ratings }, function(err, rowsAffected) {
        if (err) {
          res.status(500).send();
        }
        if (rowsAffected.ok === 1) {
          res.status(204).send();
        }
        res.status(500).send();
      });


    });

  }
};
