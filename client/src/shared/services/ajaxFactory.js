(function() {
  'use strict';

  angular.module('app')
  .factory('ajaxFactory', ['$http', function($http) {
    var serverUrl = 'http://localhost:3000';
    var ajaxObj = {};

    ajaxObj.getProfileData = function(username) {
      return $http({
        method: 'GET',
        url: serverUrl + '/choice',
        //params can be retrieved from server using req.query.username
        params: { username: username }
      });
    };

    ajaxObj.facebookAuth = function(type) {
      return $http({
        method: 'GET',
        url: serverUrl + '/auth/facebook',
        params: {type: type}
      });
    };

    ajaxObj.isOrderComplete = function(transactionId) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/order/details',
        data: { 'transactionId': transactionId }
      });
    };

    ajaxObj.postSignUp = function(user) {
      return $http({
        method: 'POST',
        url: serverUrl + '/signup',
        //user data can be retrieved from server using req.data.user
        data: { user: user }
      });
    };

    ajaxObj.getActiveShops = function(area) {
      return $http({
        method: 'GET',
        url: serverUrl + '/requester/task',
        //user data can be retrieved from server using req.data.area
        data: {area: area}
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

    ajaxObj.getOpenRequests = function(location) {
      return $http({
        method: 'GET',
        url: serverUrl + '/hero/task',
        //this param should uniquely identify the restaurant
        params: { location: location }
      });
    };

    ajaxObj.confirmRequest = function(transactionId) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/task',
        //this param should uniquely identify the restaurant
        data: { transactionId: transactionId }
      });
    };

    ajaxObj.sendOrder = function(order) {
      return $http({
        method: 'POST',
        url: serverUrl + '/requester/task',
        data: { order: order }
      });
    };


    return ajaxObj;

  }]);

})();
