var Transaction = require('../transactions/transactionModel.js');
var Checkin = require('../checkins/checkinModel.js');
var Yelp = require("yelp");
var Q = require('q');
var User = require('./../users/userModel.js');
var twilio = require('../twilio/twilioApi.js');


var api_keys;

// load apikeys if localhost. process.env.DEPLOYED set in heroku
if (!process.env.DEPLOYED) {
  api_keys = require('../config/api_keys.js').yelp;
}


function distanceMiles(lat1, long1, lat2, long2) {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((long2 - long1) * p)) / 2;

  return 7917.8788 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function findOccurenceInTransactions(yelpID, transactions) {
  var occurence = 0;
  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].vendorYelpId === yelpID) {
      occurence++;
    }
  }
  return occurence;
}

function calculateAverageRating(ratings) {
  var total = 0;
  var count = 0;
  for (var key in ratings) {
    if (ratings[key] !== undefined) {
      total += Number(ratings[key]);
      count += 1;
    }
  }
  if (count === 0) {
    return undefined;
  } else {
    return total / count;
  }
}


module.exports = {
  /*
   * @param {Object} on req.query {lat: lat, long: long}
   * @return {Array} Array with map and location options
   */
  getLocationOptions: function(req, res, next) {
    var lat = req.query.lat;
    var long = req.query.long;
    var location = lat + ',' + long;
    var context = this;

    // store venue info from yelp
    var venues = [];
    var transactions = [];

    //find transactions within a 1 mile radius
    Transaction.find({
      status: "unfulfilled",
      meetingTime: { $gte: Date.now() }
    }, function(err, transactions) {
      transactions = transactions.filter(function(transaction) {
        var coords = transaction.meetingLocation;
        return distanceMiles(lat, long, coords[0], coords[1]) < 1;
      });

      // use environment variable in heroku if deployed, api_keys.js if local
      var yelp = Yelp.createClient({
        consumer_key: process.env.YELP_CONSUMER_KEY || api_keys.consumer_key,
        consumer_secret: process.env.YELP_CONSUMER_SECRET || api_keys.consumer_secret,
        token: process.env.YELP_TOKEN || api_keys.token,
        token_secret: process.env.YELP_TOKEN_SECRET || api_keys.token_secret
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
        radius_filter: 1610,
        limit: 10
      }, function(error, data) {
        var venuesFromYelp = data.businesses;
        venuesFromYelp.forEach(function(venue) {
          //check whether an open transaction exists with this venue's yelpID, and how many are there
          var noOfOpenRequests = findOccurenceInTransactions(venue.id, transactions);
          venues.push({
            yelpId: venue.id,
            name: venue.name,
            //address: venue.location.address,
            //city: venue.location.city,
            //state: venue.location.state_code,
            //zip: venue.location.postal_code,

            // displayAddress in []. May include building name + full address
            displayAddress: venue.location.display_address.join(' '),

            lat: venue.location.coordinate.latitude,
            long: venue.location.coordinate.longitude,
            requests: noOfOpenRequests

            // ########## format
            //phone: venue.phone,

            // +1-###-###-#### format
            //displayPhone: venue.display_phone,

            // distance from hero in meters
            //distance: venue.distance,

            //categories: venue.categories,
            //image_url: venue.image_url
          });
        });
        res.status(200).send(venues);
      });
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
      meetingLocation: [location.lat, location.long],
      vendorYelpId: location.yelpId,
      meetingAddress: location.meetingAddress

    });

    newCheckin.save(function(err) {
      if (err) {
        consoole.log(err);
        res.status(500).send();
      } else {
        // returning newCheckin._id, may use it in /hero/task
        res.status(201).send(newCheckin._id);
      }
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

    Transaction.update({
      _id: transactionId
    }, update, function(err, rowsAffected) {
      if (err) {
        res.status(500).send();
        return;
      }
      if (rowsAffected.ok === 1) {
        //run here the funtion smsRequestAccepted
        //send sms with Request info to the Requester

        Checkin.remove({
          username: queueHero
        }, function(err) {
          if (err) {
            res.status(500).send();
            return;
          }
        });

        res.status(204).send();
        setTimeout(function() {
           twilio.smsRequestAccepted(transactionId);
        }, 0);

      } else {
        res.status(500).send();
      }

    });

  },

  removeFromCheckin: function(req, res) {
    var queueHero = req.body.username;

    Checkin.remove({
      username: queueHero
    }, function(err) {
      if (err) {
        res.status(500).send();
        return;
      }
      res.status(204).send();
    });

  },

  getOpenRequests: function(req, res, next) {
    //get location from request
    var vendorYelpId = req.query.vendorYelpId;

    //TODO: (db) find all transactions with yelpId = ^
    //currently this query just gets all transactions that are not complete
    Transaction.find({
      status: 'unfulfilled',
      vendorYelpId: vendorYelpId,
      meetingTime: { $gte: Date.now() }

    }, function(err, transactions) {
      if (err) {
        res.status(500).send();
        return;
      }
      res.status(200).send(transactions);

    });

  },
  rateRequester: function(req, res, next) {
    //get rating and requester from request
    var rating = req.body.rating;
    var requester = req.body.requester;
    var transactionId = req.body.transactionId;

    User.findOne({
      username: requester
    }, function(err, user) {
      if (err) {
        res.status(500).send();
        return;
      }
      if (!user) {
        res.status(401).send();
        return;
      }
      var ratings = user.ratings;
      ratings[transactionId] = rating;
      var averageRating = calculateAverageRating(ratings);
      User.update({
        username: requester
      }, {
        ratings: ratings,
        averageRating: averageRating
      }, function(err, rowsAffected) {
        if (err) {
          res.status(500).send();
          return;
        }
        if (rowsAffected.ok === 1) {
          res.status(204).send();
          return;
        }
        res.status(500).send();
      });


    });

  },
  getRequesterRating: function(req, res) {
    var username = req.query.username;

    User.findOne({
      username: username
    }, 'username averageRating' , function(err, user) {
      if (err) {
        res.status(500).send();
        return;
      } else {
        return res.status(200).send(user);
      }
    });
  }
};
