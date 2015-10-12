var TransactionCtrl = require('../transactions/transactionCtrl.js');
var Transaction = require('./../transactions/transactionModel.js');
var User = require('./../users/userModel.js');
var Checkin = require('./../checkins/checkinModel.js');
var Q = require('q');
var Yelp = require("yelp");

var Auth;

//load apikeys if local host. process.env.DEPLOYED set in heroku
if (!process.env.DEPLOYED) {
  Auth = require('../config/api_keys.js');
}

function distanceMiles(lat1, long1, lat2, long2) {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((long2 - long1) * p)) / 2;

  return 7917.8788 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function findOccurenceInCheckins(yelpID, checkins) {
  var occurence = 0;
  for (var i = 0; i < checkins.length; i++) {
    if (checkins[i].vendorYelpId === yelpID) {
      occurence++;
    }
  }
  return occurence;
}

module.exports = {
  createTransaction: function(req, res, next) {
    //extract order details from req
    var requester = req.body.order.requester;
    var item = req.body.order.item;
    var additionalRequests = req.body.order.additionalRequests;
    var moneyExchanged = req.body.order.moneyExchanged;
    var vendor = req.body.order.vendor;
    var meetingLocation = req.body.order.meetingLocation;
    var meetingTime = req.body.order.meetingTime;
    var status = 'unfulfilled';
    var vendorYelpId = req.body.order.vendorYelpId;

    var transaction = new Transaction({
      requester: requester,
      item: item,
      additionalRequests: additionalRequests,
      moneyExchanged: moneyExchanged,
      meetingLocation: meetingLocation,
      meetingTime: meetingTime,
      status: status,
      vendor: vendor,
      vendorYelpId: vendorYelpId
    });

    transaction.save(function(err, transaction) {
      if (err) {
        res.status(500).send();
        return;
      } else {
        res.status(201).send(transaction._id);
      }
    });

  },
  fulfillTransaction: function(req, res, next) {

    //extract transaction id from req
    var transactionId = req.body.transactionId;
    Transaction.update({
      _id: transactionId
    }, {
      status: 'complete'
    }, function(err, affected) {
      if (err) {
        res.status(500).send();
        return;
      }
      if (affected.ok === 1) {
        res.status(201).send();
        return;
      }
      res.status(500).send();
    });

    //TODO: (db) update the transaction status of above transaction to 'fulfilled'

  },
  checkOrderAccepted: function(req, res, next) {
    //extract transaction id from req
    var transactionId = req.query.transactionId;

    Transaction.findOne({
      _id: transactionId
    }, function(err, transaction) {
      if (err) {
        res.status(500).send();
        return;
      }
      if (!transaction) {
        res.status(401).send();
      } else if (transaction.queueHero) {
        res.status(200).send(transaction.queueHero);
      } else {
        res.status(200).send(false);
      }
    });

  },
  getLocationOptions: function(req, res, next) {
    if (req.query.lat === undefined || req.query.long === undefined) {
      res.status(400).send();
      return;
    }
    var lat = req.query.lat;
    var long = req.query.long;
    var location = lat + ',' + long;
    var context = this;

    var venues = [];
    var checkins = [];

    //find checkins within a 1 mile radius
    Checkin.find({}, function(err, checkins) {
      checkins = checkins.filter(function(checkin) {
        var coords = checkin.meetingLocation;
        return distanceMiles(lat, long, coords[0], coords[1]) < 1;
      });

      var yelp = Yelp.createClient({
        consumer_key: process.env.YELP_CONSUMER_KEY || Auth.yelp.consumer_key,
        consumer_secret: process.env.YELP_CONSUMER_SECRET || Auth.yelp.consumer_secret,
        token: process.env.YELP_TOKEN || Auth.yelp.token,
        token_secret: process.env.YELP_TOKEN_SECRET || Auth.yelp.token_secret
      });

      //find venues within a 1 mile radius
      yelp.search({
        ll: location,
        sort: 1,
        category_filter: 'food', 
        radius_filter: 1610, //1 mile
        limit: 10
      }, function(error, data) {
          var venuesFromYelp = data.businesses;
          venuesFromYelp.forEach(function(venue) {
            //check whether a checkin exists with this venue's yelpID, and how many are there
            var noOfHeroes = findOccurenceInCheckins(venue.id, checkins);
            venues.push({
              yelpId: venue.id, 
              name: venue.name, 
              displayAddress: venue.location.display_address.join(' '),
              lat: venue.location.coordinate.latitude,
              long: venue.location.coordinate.longitude,
              heroes: noOfHeroes
            });
          });
        res.status(200).send(venues);
      });
    });
  },
  rateHero: function(req, res, next) {
    //extract rating and queueHero from req
    var rating = req.body.rating;
    var queueHero = req.body.queueHero;
    var transactionId = req.body.transactionId;
    console.log('rating hero for transaction ', transactionId);

    User.findOne({
      username: queueHero
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
      User.update({
        username: queueHero
      }, {
        ratings: ratings
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

  cancelTransaction: function(req, res) {
    var _id = req.body.transactionId;

    Transaction.update({
      _id: _id
    }, {
      status: 'closed'
    }, function(err) {
      if (err) {
        res.status(500).send();
        return;
      }
      res.status(204).send();
    });
  },

  getDirections: function(req, res) {
    var source = req.query.source;
    var destination = req.query.destination;

    //make mapbox API call
  }
};
