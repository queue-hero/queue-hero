(function() {
  'use strict';

  angular.module('app.requester_task')
  .factory('requesterTaskModel', ['$http', 'herokuUrl', 'serverUrl', function($http, herokuUrl, serverUrl) {
    var model = {};

    model.getVenuesAtRequesterLocation = function(lat, long) {
      return $http({
        method: 'GET',
        url: serverUrl + '/requester/task',
        params: {
          lat: lat,
          long: long
         }
      });
    };

    model.sendOrder = function(order) {
      return $http({
        method: 'POST',
        url: serverUrl + '/requester/task',
        data: { order: order }
      });
    };

    return model;

  }]);


})();
