(function() {
  'use strict';

  angular.module('app')
  .factory('ajaxFactory', ['$http', function($http) {

    // use herokuUrl if deployed, else use localhost:3000
    var herokuUrl = 'https://queue-hero.herokuapp.com';
    var serverUrl = document.location.hostname === 'localhost' ? 'http://localhost:3000' : herokuUrl;
    var ajaxObj = {};

    ajaxObj.getProfileData = function(facebookId) {
      return $http({
        method: 'GET',
        url: serverUrl + '/choice',
        params: { facebookId: facebookId }
      });
    };

    ajaxObj.facebookAuth = function(type) {
      return $http({
        method: 'GET',
        url: serverUrl + '/auth/facebook',
        params: {type: type}
      });
    };

    ajaxObj.orderFulfilled = function(transactionId) {
      return $http({
        method: 'POST',
        url: serverUrl + '/requester/order/complete',
        data: { 'transactionId': transactionId }
      });
    };

    ajaxObj.isOrderComplete = function(transactionId) {
      return $http({
        method: 'GET',
        url: serverUrl + '/hero/order/details',
        params: { transactionId: transactionId }
      });
    };

    ajaxObj.isOrderAccepted = function(transactionId) {
      return $http({
        method: 'GET',
        url: serverUrl + '/requester/order/details',
        params: { transactionId: transactionId }
      });
    };

    ajaxObj.postSignUp = function(user) {
      return $http({
        method: 'POST',
        url: serverUrl + '/signup',
        data: { user: user }
      });
    };

    ajaxObj.getActiveShops = function(area) {
      return $http({
        method: 'GET',
        url: serverUrl + '/requester/task',
        params: { area: area }
      });
    };

    ajaxObj.getVenuesAtHeroLocation = function(lat, long) {
      return $http({
        method: 'GET',
        url: serverUrl + '/hero/location',
        // this param should identify the location (lat, long) of hero
        // server returns list of vendors for hero to confirm
        params: {
          lat: lat,
          long: long
        }
      });
    };

    ajaxObj.setHeroLocation = function(queueHero, location) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/location',
        data: {
          queueHero: queueHero,
          location: location
        }
      });
    };

    ajaxObj.getOpenRequests = function(vendorYelpId) {
      return $http({
        method: 'GET',
        url: serverUrl + '/hero/task',
        //this param should uniquely identify the restaurant
        params: { vendorYelpId: vendorYelpId }
      });
    };

    ajaxObj.confirmRequest = function(transactionId, queueHero) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/task',
        data: {
          transactionId: transactionId,
          queueHero: queueHero
        }
      });
    };

    ajaxObj.sendOrder = function(order) {
      return $http({
        method: 'POST',
        url: serverUrl + '/requester/task',
        data: { order: order }
      });
    };

    ajaxObj.rateRequester = function(rating, requester, transactionId) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/order/complete',
        data: {
          rating: rating,
          requester: requester,
          transactionId: transactionId
        }
      });
    };

    ajaxObj.rateHero = function(rating, queueHero, transactionId) {
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


    return ajaxObj;

  }]);

})();
