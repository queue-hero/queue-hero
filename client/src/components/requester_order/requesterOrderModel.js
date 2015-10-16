(function() {
  'use strict';

  angular.module('app.requester_order')
  .factory('requesterOrderModel', ['$http', 'herokuUrl', 'serverUrl', function($http, herokuUrl, serverUrl) {
    var model = {};

    model.cancelOrder = function(transactionId) {
      return $http({
        method: 'POST',
        url: serverUrl + '/requester/order/details/cancel',
        data: { transactionId: transactionId }
      });
    };

    model.getDirections = function(currentLocation, meetingLocation) {
      return $http({
        method: 'GET',
        url: serverUrl + '/requester/order/directions',
        params: { source: currentLocation, destination: meetingLocation }
      });
    };

    model.orderFulfilled = function(transactionId) {
      return $http({
        method: 'POST',
        url: serverUrl + '/requester/order/complete',
        data: { 'transactionId': transactionId }
      });
    };

    model.rateHero = function(rating, queueHero, transactionId) {
      return $http({
        method: 'POST',
        url: serverUrl + '/requester/order/rate',
        data: {
          rating: rating,
          queueHero: queueHero,
          transactionId: transactionId
        }
      });
    };

    return model;

  }]);


})();
