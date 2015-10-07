var TransactionCtrl = require('../transactions/transactionCtrl.js');
var Transaction = require('./../transactions/transactionModel.js');
var Checkin = require('./../checkins/checkinModel.js');
var Q = require('q');

function distanceMiles(lat1, long1, lat2, long2) {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((long2 - long1) * p)) / 2;

  return 7917.8788 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
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

    var transaction = new Transaction({
      requester: requester,
      item: item,
      additionalRequests: additionalRequests,
      moneyExchanged: moneyExchanged,
      vendor: vendor,
      meetingLocation: meetingLocation,
      meetingTime: meetingTime,
      status: status
    });

    transaction.save(function(err, transaction) {
      if (err) {
        res.status(500).send();
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
      }
      if (affected.ok === 1) {
        res.status(201).send();
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
    }, function(err, user) {
      if (err) {
        res.status(500).send();
      }
      if (!user) {
        res.status(401).send();
      } else if (user.queueHero) {
        res.status(200).send(user.queueHero);
      }

      res.status(200).send(false);
    });

  },
  getActiveShops: function(req, res, next) {
    if (req.query.location === undefined) {
      res.status(400).send();
    }
    var lat1 = req.query.location[0];
    var long1 = req.query.location[1];

    Checkin.find({}, function(err, checkins) {
      if (err) {
        res.status(500).send();
      }

      //filters for checkins within a 1 mile radius
      var activeShops = checkins.filter(function(checkin) {
        var coords = checkin.meetingLocation;
        return distanceMiles(lat1, long1, coords[0], coords[1]) < 1;
      });

      res.status(200).send(activeShops);
    });

  },
  rateHero: function(req, res, next) {
    //extract rating and queueHero from req
    var rating = req.body.rating;
    var queueHero = req.body.queueHero;
    var transactionId = req.body.transactionId;

    User.findOne({
      username: queueHero
    }, function(err, user) {
      if (err) {
        res.status(500).send();
      }
      if (!user) {
        res.status(401).send();
      }
      var ratings = user.ratings;
      ratings.transactionId = rating;
      User.update({
        username: queueHero
      }, {
        ratings: ratings
      }, function(err, rowsAffected) {
        if (err) {
          res.status(500).send();
        }
        if (rowsAffected.ok === 1) {
          res.status(204).send();
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
      }
      res.status(204).send();
    });
  }
};
